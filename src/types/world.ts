// ─────────────────────────────────────────────
// World Builder — Type Definitions
// ─────────────────────────────────────────────

/** All editable fields for a world, mapped to Prisma WorldItem columns */
export interface WorldFormData {
  // Step 1 — Core Identity
  name: string;
  summary: string;
  tagline: string;
  /** Stored as JSON in aestheticKeywords: { genre, tone } */
  genre: string;
  tone: string;

  // Step 2 — Time Structure
  timeSetting: string;   // era name / time period
  timeline: string;      // key historical events

  // Step 3 — World Rules
  physicsRules: string;
  rules: string;         // power system + limitations

  // Step 4 — Civilization
  socialStructure: string;
  factions: string;

  // Step 5 — Environment
  geography: string;

  // Step 6 — Narrative Context
  majorConflict: string;

  // Meta
  visibility: 'private' | 'public';
}

export const EMPTY_WORLD_FORM: WorldFormData = {
  name: '',
  summary: '',
  tagline: '',
  genre: '',
  tone: '',
  timeSetting: '',
  timeline: '',
  physicsRules: '',
  rules: '',
  socialStructure: '',
  factions: '',
  geography: '',
  majorConflict: '',
  visibility: 'private',
};

/** The 10 fields used for completion score calculation */
export const COMPLETION_FIELDS: (keyof WorldFormData)[] = [
  'name',
  'summary',
  'timeSetting',
  'timeline',
  'physicsRules',
  'rules',
  'socialStructure',
  'factions',
  'geography',
  'majorConflict',
];

// ─────────────────────────────────────────────
// Step / Module configuration
// ─────────────────────────────────────────────

export type WorldModuleName =
  | 'core-identity'
  | 'time-structure'
  | 'world-rules'
  | 'civilization'
  | 'environment'
  | 'narrative-context';

export interface FieldConfig {
  key: keyof WorldFormData;
  label: string;
  placeholder: string;
  hint: string;
  examples: string[];
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
}

export interface WorldStepConfig {
  step: number;
  module: WorldModuleName;
  title: string;
  description: string;
  fields: FieldConfig[];
}

export const WORLD_STEPS: WorldStepConfig[] = [
  {
    step: 1,
    module: 'core-identity',
    title: 'Core Identity',
    description: 'Give your world a name and a soul — the foundation everything else builds on.',
    fields: [
      {
        key: 'name',
        label: 'World Name',
        placeholder: 'e.g., Archive City',
        hint: 'The name your world is known by.',
        examples: ['Archive City', 'The Shattered Expanse', 'New Meridian'],
        type: 'text',
        required: true,
      },
      {
        key: 'tagline',
        label: 'Tagline',
        placeholder: 'e.g., A civilization where memories are stored as physical artifacts.',
        hint: 'One sentence that captures the essence of your world.',
        examples: [
          'A civilization where memories are stored as physical artifacts.',
          'The last city standing after the sky fell.',
        ],
        type: 'text',
      },
      {
        key: 'genre',
        label: 'Genre',
        placeholder: 'Select a genre',
        hint: 'The primary genre of your world.',
        examples: ['sci-fi', 'fantasy', 'cyberpunk'],
        type: 'select',
        options: ['sci-fi', 'fantasy', 'cyberpunk', 'alternate history', 'post-human', 'mythic', 'horror', 'solarpunk', 'other'],
      },
      {
        key: 'tone',
        label: 'Tone',
        placeholder: 'Select a tone',
        hint: 'The emotional atmosphere of your world.',
        examples: ['dark', 'hopeful', 'mysterious'],
        type: 'select',
        options: ['dark', 'hopeful', 'mysterious', 'utopian', 'dystopian', 'epic', 'melancholic', 'whimsical', 'other'],
      },
      {
        key: 'summary',
        label: 'Summary',
        placeholder: 'Describe your world in a few sentences...',
        hint: 'A brief introduction to your world.',
        examples: [
          'A megacity built on the ruins of the old world, where memory is currency.',
          'An archipelago of floating islands, each governed by a different elemental faction.',
        ],
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    step: 2,
    module: 'time-structure',
    title: 'Time Structure',
    description: 'Define when your world exists and the key moments that shaped it.',
    fields: [
      {
        key: 'timeSetting',
        label: 'Era / Time Period',
        placeholder: 'e.g., 2150 AD — The Archive Era',
        hint: 'When does your world take place?',
        examples: ['2150 AD — The Archive Era', 'Year 0 of the Second Founding', 'The Age of Collapse'],
        type: 'text',
      },
      {
        key: 'timeline',
        label: 'Key Historical Events',
        placeholder: '2030 – Archive technology invented\n2050 – Memory trade legalized\n2090 – Archive City established',
        hint: 'List the major events that shaped your world, one per line.',
        examples: [
          '2030 – Archive technology invented\n2050 – Memory trade legalized',
          'Year 1 – The Great Fracture\nYear 45 – First Sky City built',
        ],
        type: 'textarea',
      },
    ],
  },
  {
    step: 3,
    module: 'world-rules',
    title: 'World Rules',
    description: 'What makes your world different? Define the laws that govern it.',
    fields: [
      {
        key: 'physicsRules',
        label: 'Physics & Magic Rules',
        placeholder: 'e.g., Memory can be materialized into physical objects.',
        hint: 'How does your world differ from reality? What special laws apply?',
        examples: [
          'Memory can be materialized into physical objects.',
          'Gravity reverses every 12 hours.',
          'Magic is powered by emotional debt.',
        ],
        type: 'textarea',
      },
      {
        key: 'rules',
        label: 'Power System & Limitations',
        placeholder: 'e.g., Memory manipulation — but memories decay after 100 years.',
        hint: 'What powers exist, and what are their costs or limits?',
        examples: [
          'Memory manipulation — but memories decay after 100 years.',
          'Elemental channeling — each user is bound to one element for life.',
        ],
        type: 'textarea',
      },
    ],
  },
  {
    step: 4,
    module: 'civilization',
    title: 'Civilization',
    description: 'Who lives here, how do they organize, and what do they believe?',
    fields: [
      {
        key: 'socialStructure',
        label: 'Governance & Social Structure',
        placeholder: 'e.g., Council of Archivists rules over a tiered citizen class.',
        hint: 'How is society organized and governed?',
        examples: [
          'Council of Archivists rules over a tiered citizen class.',
          'Corporate oligarchy — five megacorps divide all territory.',
        ],
        type: 'textarea',
      },
      {
        key: 'factions',
        label: 'Factions & Groups',
        placeholder: 'e.g., The Archivists, Memory Traders, Data Erasers',
        hint: 'List the major factions, organizations, or groups.',
        examples: [
          'The Archivists — keepers of memory\nMemory Traders — black market dealers\nData Erasers — anarchist rebels',
          'The Iron Court\nThe Wandering Clans\nThe Void Monks',
        ],
        type: 'textarea',
      },
    ],
  },
  {
    step: 5,
    module: 'environment',
    title: 'Environment',
    description: 'Paint the physical world — landscapes, cities, and the atmosphere.',
    fields: [
      {
        key: 'geography',
        label: 'Geography, Cities & Landmarks',
        placeholder: 'e.g., A desert megacity surrounded by data fog. The Great Archive towers at its center.',
        hint: 'Describe the physical landscape, major cities, and notable landmarks.',
        examples: [
          'A desert megacity surrounded by data fog. The Great Archive towers at its center.',
          'Floating islands connected by sky bridges. The Sunken Capital lies below the clouds.',
        ],
        type: 'textarea',
      },
    ],
  },
  {
    step: 6,
    module: 'narrative-context',
    title: 'Narrative Context',
    description: 'What stories live here? What tensions drive the world forward?',
    fields: [
      {
        key: 'majorConflict',
        label: 'Conflict, Themes & Story Hooks',
        placeholder: 'e.g., Memory ownership wars. Themes: identity, power, control. Hook: A lost archive threatens the city\'s history.',
        hint: 'What are the central conflicts, themes, and potential story starting points?',
        examples: [
          'Memory ownership wars. Themes: identity, power, control. Hook: A lost archive threatens the city\'s history.',
          'The sky is falling — literally. Themes: survival, sacrifice. Hook: Someone is sabotaging the sky anchors.',
        ],
        type: 'textarea',
      },
    ],
  },
];
