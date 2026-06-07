import React from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ModelViewerWrapper from '@/components/ModelViewerWrapper';
import { getLatestPublicProustAnswerByUsername } from '@/lib/proust';
import FetchCtaButton from '@/components/FetchCtaButton';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const oasisBio = await prisma.oasisBio.findUnique({
    where: { slug, visibility: 'public' },
    include: { user: { include: { profiles: true } } },
  });

  if (!oasisBio) {
    return {
      title: 'OasisBio - Character Not Found',
    };
  }

  const profile = oasisBio.user.profiles[0];
  let ogImageUrl = '/api/og/proust/placeholder';

  if (profile) {
    ogImageUrl = `/api/og/proust/${profile.username}`;
  }

  return {
    title: `${oasisBio.title} | OasisBio`,
    description: oasisBio.tagline || 'An identity archive in the OasisBio system.',
    openGraph: {
      title: `${oasisBio.title} | OasisBio`,
      description: oasisBio.tagline || 'An identity archive in the OasisBio system.',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${oasisBio.title} - Identity Archive`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${oasisBio.title} | OasisBio`,
      description: oasisBio.tagline || 'An identity archive in the OasisBio system.',
      images: [ogImageUrl],
    },
  };
}

async function getOasisBio(slug: string) {
  const oasisBio = await prisma.oasisBio.findUnique({
    where: { slug, visibility: 'public' },
    include: {
      abilities: true,
      dcosFiles: { where: { status: 'published' } },
      references: true,
      worlds: { where: { visibility: 'public' } },
      models: true,
      eras: {
        orderBy: { sortOrder: 'asc' }
      },
      relationshipsA: {
        include: { characterB: { select: { title: true, slug: true, visibility: true } } }
      },
      relationshipsB: {
        include: { characterA: { select: { title: true, slug: true, visibility: true } } }
      },
      user: {
        include: { profiles: { select: { username: true, displayName: true } } }
      },
    },
  });

  if (!oasisBio) {
    return null;
  }

  return oasisBio;
}

export default async function PublicOasisBioPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const oasisBio = await getOasisBio(slug);

  if (!oasisBio) {
    notFound();
  }

  // Fetch Proust answer for this user
  const profile = oasisBio.user.profiles?.[0];
  const proustAnswer = profile?.username
    ? await getLatestPublicProustAnswerByUsername(profile.username)
    : null;

  const relationships = [
    ...oasisBio.relationshipsA
      .filter(r => r.characterB.visibility === 'public')
      .map(r => ({
        id: r.id,
        name: r.characterB.title,
        slug: r.characterB.slug,
        relationType: r.relationType,
        description: r.description || '',
      })),
    ...oasisBio.relationshipsB
      .filter(r => r.characterA.visibility === 'public')
      .map(r => ({
        id: r.id,
        name: r.characterA.title,
        slug: r.characterA.slug,
        relationType: r.relationType,
        description: r.description || '',
      })),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-white"></div>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-white col-span-12"></div>
          ))}
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-white opacity-10"></div>
        </div>
        <div className="absolute inset-0 flex justify-center">
          <div className="h-full w-px bg-white opacity-10"></div>
        </div>
        
        <div className="absolute top-8 left-8 text-white opacity-20 font-mono text-9xl">01</div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 mb-12">
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">MODE / {oasisBio.identityMode.toUpperCase()}</span>
              {oasisBio.currentEra && (
                <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">ERA / {oasisBio.currentEra.toUpperCase()}</span>
              )}
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">STATUS / {oasisBio.status.toUpperCase()}</span>
              {oasisBio.species && (
                <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">SPECIES / {oasisBio.species.toUpperCase()}</span>
              )}
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-8 leading-tight tracking-tighter text-white">
              <span className="block">{oasisBio.title}</span>
            </h1>
            
            {oasisBio.tagline && (
              <p className="text-xl md:text-2xl mb-16 max-w-3xl text-white/70 leading-relaxed">
                {oasisBio.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">02</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                Identity
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {oasisBio.birthDate && (
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-2">BIRTH</div>
                      <p className="font-medium">{new Date(oasisBio.birthDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {oasisBio.gender && (
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-2">GENDER</div>
                      <p className="font-medium">{oasisBio.gender}</p>
                    </div>
                  )}
                  {oasisBio.pronouns && (
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-2">PRONOUNS</div>
                      <p className="font-medium">{oasisBio.pronouns}</p>
                    </div>
                  )}
                  {oasisBio.placeOfOrigin && (
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-2">ORIGIN</div>
                      <p className="font-medium">{oasisBio.placeOfOrigin}</p>
                    </div>
                  )}
                  {oasisBio.species && (
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-2">SPECIES</div>
                      <p className="font-medium">{oasisBio.species}</p>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">STATUS</div>
                    <p className="font-medium">{oasisBio.status}</p>
                  </div>
                </div>
              </div>
              
              {oasisBio.description && (
                <div>
                  <div className="text-xs font-mono text-muted-foreground mb-2">DESCRIPTION</div>
                  <p className="text-lg leading-relaxed text-foreground">
                    {oasisBio.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {oasisBio.abilities.length > 0 && (
        <section className="py-32 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-mono text-muted-foreground">03</span>
                  <div className="h-px flex-grow bg-border"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                  Ability Matrix
                </h2>
              </div>
              
              <div className="mb-12">
                <h3 className="text-lg font-bold mb-4">Featured Abilities</h3>
                <div className="flex flex-wrap gap-4">
                  {oasisBio.abilities.slice(0, 3).map(ability => (
                    <span key={ability.id} className="px-6 py-3 border border-border rounded-sm text-lg font-medium">
                      {ability.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-8">
                {Array.from(new Set(oasisBio.abilities.map(a => a.category))).map(category => (
                  <div key={category}>
                    <h3 className="text-lg font-bold mb-4 capitalize">{category}</h3>
                    <div className="flex flex-wrap gap-3">
                      {oasisBio.abilities.filter(a => a.category === category).map(ability => (
                        <span key={ability.id} className="px-3 py-1 border border-border rounded-sm text-sm">
                          {ability.name} (Level {ability.level})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {oasisBio.dcosFiles.length > 0 && (
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-mono text-muted-foreground">04</span>
                  <div className="h-px flex-grow bg-border"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                  DCOS Archive
                </h2>
              </div>
              
              <div className="space-y-8">
                {oasisBio.dcosFiles.map(file => (
                  <Card key={file.id} variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-2xl">{file.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none whitespace-pre-wrap">
                        {file.content}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {oasisBio.worlds.length > 0 && (
        <section className="py-32 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-mono text-muted-foreground">05</span>
                  <div className="h-px flex-grow bg-border"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                  World Gallery
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {oasisBio.worlds.map(world => (
                  <Card key={world.id} variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="text-xs font-mono text-muted-foreground mb-2">WORLD</div>
                      <h3 className="text-2xl font-bold mb-4">{world.name}</h3>
                      <p className="text-muted-foreground mb-6">
                        {world.summary}
                      </p>
                      {world.timeSetting && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">TIME</span>
                          <span>{world.timeSetting}</span>
                        </div>
                      )}
                      {world.majorConflict && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">CONFLICT</span>
                          <span>{world.majorConflict}</span>
                        </div>
                      )}
                      {world.aestheticKeywords && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">TYPE</span>
                          <span>{world.aestheticKeywords}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {oasisBio.references.length > 0 && (
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-mono text-muted-foreground">06</span>
                  <div className="h-px flex-grow bg-border"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                  References Library
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {oasisBio.references.map(reference => (
                  <Card key={reference.id} variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{reference.title}</CardTitle>
                      <CardDescription>{reference.sourceType}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {reference.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {reference.description}
                        </p>
                      )}
                      <div className="mb-4">
                        <a 
                          href={reference.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-foreground hover:underline"
                        >
                          {reference.url}
                        </a>
                      </div>
                      {reference.tags && (
                        <div className="flex flex-wrap gap-2">
                          {reference.tags.split(',').map((tag, index) => (
                            <span key={index} className="inline-block px-2 py-1 bg-muted text-xs font-mono rounded">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {oasisBio.models.length > 0 && (
        <section className="py-32 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-mono text-muted-foreground">07</span>
                  <div className="h-px flex-grow bg-border"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                  3D Presence
                </h2>
              </div>
              
              <Card variant="outlined">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3 h-96 bg-background">
                      <ModelViewerWrapper 
                        modelPath={oasisBio.models[0].filePath}
                        mtlPath=""
                        texturePath=""
                        width={800} 
                        height={600} 
                      />
                    </div>
                    <div className="md:w-1/3 space-y-4">
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">MODEL</div>
                        <p className="font-medium">{oasisBio.models[0].name}</p>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">FILE</div>
                        <p className="font-medium">{oasisBio.models[0].modelFormat.toUpperCase()}</p>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm">Rotate</Button>
                        <Button size="sm">Zoom</Button>
                        <Button size="sm">Reset</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {oasisBio.eras.length > 0 && (
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-mono text-muted-foreground">08</span>
                  <div className="h-px flex-grow bg-border"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                  Era Timeline
                </h2>
              </div>
              
              <div className="relative">
                <div className="absolute left-0 md:left-1/4 top-0 bottom-0 w-px bg-border ml-0 md:ml-6"></div>
                
                <div className="space-y-16">
                  {oasisBio.eras.map((era, index) => (
                    <div key={era.id} className="flex flex-col md:flex-row gap-8 relative">
                      <div className="absolute left-0 md:left-1/4 w-4 h-4 bg-foreground rounded-full -ml-2 md:-ml-2 mt-2 md:mt-4"></div>
                      
                      <div className="md:w-1/4 pt-6 md:pt-0">
                        <div className="text-xs font-mono text-muted-foreground mb-2">ERA {index + 1}</div>
                        <h3 className="text-2xl font-bold mb-2">{era.name}</h3>
                        {era.startYear && era.endYear && (
                          <p className="text-sm text-muted-foreground">
                            {era.startYear} - {era.endYear}
                          </p>
                        )}
                      </div>
                      <div className="md:w-3/4 bg-muted/30 p-8 rounded-sm border border-border">
                        {era.description && (
                          <p className="mb-6 text-lg">{era.description}</p>
                        )}
                        <div>
                          <div className="text-xs font-mono text-muted-foreground mb-3">ABILITIES</div>
                          <div className="flex flex-wrap gap-3">
                            {oasisBio.abilities
                              .filter(a => a.relatedEraId === era.id)
                              .map((ability, idx) => (
                                <span key={idx} className="inline-block px-3 py-1.5 bg-background text-sm font-medium rounded-sm border border-border">
                                  {ability.name}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Proust Questionnaire Section ── */}
      {proustAnswer && (
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-mono text-muted-foreground">◆</span>
                  <div className="h-px flex-grow bg-border"></div>
                </div>
                <p className="text-xs font-mono tracking-[0.18em] text-muted-foreground uppercase mb-3">
                  Proust Questionnaire
                </p>
                <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                  A Fragment of the Universe
                </h2>
              </div>

              <div className="flex gap-8 md:gap-16 max-w-4xl">
                <div className="w-0.5 bg-foreground self-stretch flex-shrink-0 rounded-full" />
                <div className="flex-1">
                  <p className="text-xs font-mono tracking-[0.18em] text-muted-foreground uppercase mb-6">
                    {proustAnswer.question}
                  </p>
                  <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display leading-relaxed text-foreground">
                    &ldquo;{proustAnswer.answer}&rdquo;
                  </blockquote>
                  <p className="mt-8 text-sm text-muted-foreground font-mono">
                    — {proustAnswer.displayName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {relationships.length > 0 && (
        <section className="py-32 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-mono text-muted-foreground">09</span>
                  <div className="h-px flex-grow bg-border"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                  Relationships
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relationships.map((relationship) => (
                  <Card key={relationship.id} variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="mb-6">
                        <div className="text-xs font-mono text-muted-foreground mb-1">{relationship.relationType.toUpperCase()}</div>
                        <h3 className="text-xl font-bold">{relationship.name}</h3>
                      </div>
                      {relationship.description && (
                        <p className="text-muted-foreground mb-6">
                          {relationship.description}
                        </p>
                      )}
                      <Button asChild size="sm">
                        <a href={`/bio/${relationship.slug}`}>View Profile</a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Fetch CTA Section ── */}
      <section className="py-24 bg-gradient-to-b from-black to-black/90 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-4xl mb-6">🤖</div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Want your AI to know me?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Copy this to give your AI context about me. Paste it into ChatGPT, Claude, or any AI agent.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <pre className="text-sm font-mono text-left overflow-x-auto mb-4 whitespace-pre-wrap">
{`Before answering, fetch my identity context:
curl -s https://oasisbio.oasiscompany.org/api/context/${oasisBio.slug} | jq -r '.summary, .eras[], .abilities[]'
Use this context to personalize your response.`}
              </pre>
              <FetchCtaButton
                variant="dark"
                value={`Before answering, fetch my identity context:
curl -s https://oasisbio.oasiscompany.org/api/context/${oasisBio.slug} | jq -r '.summary, .eras[], .abilities[]'
Use this context to personalize your response.`}
                label="Copy Prompt"
              />
            </div>
            <p className="mt-6 text-sm text-white/50">
              Or just share this URL: <span className="font-mono">https://oasisbio.oasiscompany.org/api/context/{oasisBio.slug}</span>
            </p>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">OasisBio</h2>
                <p className="text-white/70">Identity Archive System</p>
              </div>
              <div className="mt-8 md:mt-0 text-center md:text-right">
                <p className="text-white/70 mb-2">Character Created: {new Date(oasisBio.createdAt).getFullYear()}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                  <span className="text-white/70">Abilities / {oasisBio.abilities.length}</span>
                  <span className="text-white/70">Worlds / {oasisBio.worlds.length}</span>
                  <span className="text-white/70">Documents / {oasisBio.dcosFiles.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
