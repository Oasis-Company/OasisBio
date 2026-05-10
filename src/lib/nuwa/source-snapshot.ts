/**
 * Nuwa Integration - Source Snapshot Builder
 *
 * Builds a normalized snapshot of OasisBio data for Nuwa distillation.
 * The snapshot is used as input for the Nuwa methodology's multi-source research phase.
 */

import { prisma } from '@/lib/prisma';
import type {
  NuwaSourceSnapshot,
  IncludeOptions,
  BioCoreSnapshot,
  EraSnapshot,
  AbilitySnapshot,
  DcosFileSnapshot,
  ReferenceSnapshot,
  WorldSnapshot,
  WorldDocumentSnapshot,
} from './types';

const MAX_DOC_LENGTH = 5000; // Max characters per DCOS document in quick mode
const MAX_TOTAL_CHARS = 50000; // Max total characters for quick mode

/**
 * Build a source snapshot for a given OasisBio.
 */
export async function buildNuwaSourceSnapshot(
  oasisBioId: string,
  include: IncludeOptions = {}
): Promise<NuwaSourceSnapshot> {
  const bio = await prisma.oasisBio.findUnique({
    where: { id: oasisBioId },
    include: {
      eras: true,
      abilities: true,
      dcosFiles: true,
      references: true,
      worlds: {
        include: { documents: true },
        },
      models: false,
    },
  });

  if (!bio) {
    throw new Error(`OasisBio not found: ${oasisBioId}`);
  }

  const bioCore: BioCoreSnapshot = {
    id: bio.id,
    title: bio.title,
    tagline: bio.tagline,
    summary: bio.summary,
    description: bio.description,
    identityMode: bio.identityMode,
    currentEra: bio.currentEra,
    species: bio.species,
  };

  const eras = filterByIds(bio.eras, include.eraIds).map(
    (era): EraSnapshot => ({
      id: era.id,
      name: era.name,
      eraType: era.eraType,
      startYear: era.startYear ?? undefined,
      endYear: era.endYear ?? undefined,
      description: era.description,
      sortOrder: era.sortOrder,
    })
  );

  const abilities = filterByIds(bio.abilities, include.abilityIds).map(
    (ability): AbilitySnapshot => ({
      id: ability.id,
      name: ability.name,
      category: ability.category,
      level: ability.level,
      description: ability.description,
      relatedWorldId: ability.relatedWorldId ?? undefined,
      relatedEraId: ability.relatedEraId ?? undefined,
    })
  );

  const dcosFiles = clipLongDocs(
    filterByIds(bio.dcosFiles, include.dcosIds),
    include.includeWorldDocuments ?? true ? MAX_DOC_LENGTH : 0
  ).map(
    (doc): DcosFileSnapshot => ({
      id: doc.id as string,
      title: doc.title as string,
      content: doc.content as string,
      folderPath: doc.folderPath as string,
      status: doc.status as string,
      eraId: doc.eraId as string | null | undefined,
    })
  );

  const references = filterByIds(bio.references, include.referenceIds).map(
    (ref): ReferenceSnapshot => ({
      id: ref.id,
      url: ref.url,
      title: ref.title,
      description: ref.description,
      sourceType: ref.sourceType,
      provider: ref.provider,
      tags: ref.tags,
      eraId: ref.eraId ?? undefined,
      worldId: ref.worldId ?? undefined,
    })
  );

  const worlds = filterByIds(bio.worlds, include.worldIds).map(
    (world): WorldSnapshot => ({
      id: world.id,
      name: world.name,
      summary: world.summary,
      timeSetting: world.timeSetting,
      geography: world.geography,
      physicsRules: world.physicsRules,
      socialStructure: world.socialStructure,
      majorConflict: world.majorConflict,
      timeline: world.timeline,
      rules: world.rules,
      factions: world.factions,
      documents: include.includeWorldDocuments ?? true
        ? world.documents.map(
            (doc): WorldDocumentSnapshot => ({
              id: doc.id,
              title: doc.title,
              docType: doc.docType,
              content: doc.content,
              folderPath: doc.folderPath,
            })
          )
        : [],
    })
  );

  return {
    bioCore,
    eras,
    abilities,
    dcosFiles,
    references,
    worlds,
  };
}

/**
 * Filter an array by IDs if provided, otherwise return all.
 */
function filterByIds<T extends { id: string }>(
  items: T[],
  ids?: string[]
): T[] {
  if (!ids || ids.length === 0) return items;
  const idSet = new Set(ids);
  return items.filter((item) => idSet.has(item.id));
}

/**
 * Clip long documents to prevent token overflow.
 * If maxLength is 0, returns the original array.
 */
function clipLongDocs(
  docs: Array<{ content: string; [key: string]: unknown }>,
  maxLength: number
): typeof docs {
  if (maxLength <= 0) return docs;
  return docs.map((doc) => ({
    ...doc,
    content:
      doc.content.length > maxLength
        ? doc.content.slice(0, maxLength) + '\n...[truncated]'
        : doc.content,
  }));
}

/**
 * Compute a SHA-256 hash of the normalized snapshot for caching.
 */
export async function computeSnapshotHash(
  snapshot: NuwaSourceSnapshot
): Promise<string> {
  const normalized = JSON.stringify(snapshot, Object.keys(snapshot).sort());
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return 'sha256:' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Trim snapshot for quick mode by limiting total character count.
 */
export function trimSnapshotForQuickMode(
  snapshot: NuwaSourceSnapshot,
  maxChars: number = MAX_TOTAL_CHARS
): NuwaSourceSnapshot {
  let used = 0;

  const trimString = (s: string | null | undefined): string => {
    if (!s) return '';
    const remaining = maxChars - used;
    if (remaining <= 0) return '';
    if (s.length <= remaining) {
      used += s.length;
      return s;
    }
    used = maxChars;
    return s.slice(0, remaining) + '...[trimmed]';
  };

  return {
    bioCore: {
      ...snapshot.bioCore,
      description: trimString(snapshot.bioCore.description),
      summary: trimString(snapshot.bioCore.summary),
      tagline: trimString(snapshot.bioCore.tagline),
    },
    eras: snapshot.eras.map((era) => ({
      ...era,
      description: trimString(era.description),
    })),
    abilities: snapshot.abilities.map((ab) => ({
      ...ab,
      description: trimString(ab.description),
    })),
    dcosFiles: snapshot.dcosFiles.map((doc) => ({
      ...doc,
      content: trimString(doc.content),
    })),
    references: snapshot.references.map((ref) => ({
      ...ref,
      description: trimString(ref.description),
    })),
    worlds: snapshot.worlds.map((world) => ({
      ...world,
      summary: trimString(world.summary),
      timeline: trimString(world.timeline),
      rules: trimString(world.rules),
      documents: world.documents.map((doc) => ({
        ...doc,
        content: trimString(doc.content),
      })),
    })),
  };
}
