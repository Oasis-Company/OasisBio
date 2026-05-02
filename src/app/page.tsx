import React from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OasisBio - Digital Identity Builder & Character Creator Platform',
  description: 'Build expandable digital identities and fictional characters across eras with our comprehensive character creator platform and digital identity builder.',
  keywords: [
    'digital identity builder',
    'character creator platform',
    'fictional character builder',
    'character archive',
    'identity archive',
    'character identity system'
  ],
  openGraph: {
    title: 'OasisBio - Digital Identity Builder',
    description: 'Build and manage expandable digital identities across eras',
    type: 'website',
    siteName: 'OasisBio',
  },
  twitter: {
    title: 'OasisBio - Digital Identity Builder',
    description: 'Build and manage expandable digital identities across eras',
    card: 'summary_large_image',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - 01 */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white">
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-white"></div>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-white col-span-12"></div>
          ))}
        </div>
        
        {/* System Lines */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-white opacity-10"></div>
        </div>
        <div className="absolute inset-0 flex justify-center">
          <div className="h-full w-px bg-white opacity-10"></div>
        </div>
        
        {/* Section Number */}
        <div className="absolute top-8 left-8 text-white opacity-20 font-mono text-9xl">01</div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* System Tags */}
            <div className="flex flex-wrap gap-4 mb-12">
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">DIGITAL IDENTITY</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">CHARACTER CREATOR</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">WORLD REPOSITORY</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">DYNAMIC CORE SCRIPT</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">GLB MODEL SYSTEM</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-8 leading-tight tracking-tighter text-white">
              <span className="block">BUILD</span>
              <span className="block">AN IDENTITY</span>
              <span className="block">BEYOND TIME</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-16 max-w-3xl text-white/70 leading-relaxed">
              OasisBio is a modular identity system for people, characters, worlds, and future selves.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/auth/login" className="no-underline">
                <Button size="lg" className="px-8 py-6 text-lg bg-white text-black hover:bg-gray-100">
                  Create Your OasisBio
                </Button>
              </Link>
              <Link href="/explore" className="no-underline">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg border border-white/30 text-white hover:bg-white/10">
                  Explore Identities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is OasisBio - 02 */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">02</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                What is OasisBio
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                A cross-era identity system that allows you to build expandable digital identities across time and worlds.
              </p>
            </div>
            
            {/* System Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Identity Container</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create multiple identity versions across different time periods and worlds.
                  </p>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">01</span>
                      <span>Past, Present, Future Selves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">02</span>
                      <span>Alternate and Fictional Identities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">03</span>
                      <span>Worldbound Character Versions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Ability Pool</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Define and manage skills, traits, and abilities with levels and categories.
                  </p>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">01</span>
                      <span>Custom and Official Abilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">02</span>
                      <span>Skill Levels (1-5)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">03</span>
                      <span>Era and World Binding</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Repositories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Three interconnected content systems for identity depth.
                  </p>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">01</span>
                      <span>DCOS (Core Identity Scripts)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">02</span>
                      <span>References Library</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">03</span>
                      <span>Worldbuilding Repository</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">3D Model System</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Visual representation of identities with GLB file support for better 3D model performance and compatibility.
                  </p>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">01</span>
                      <span>GLB File Uploads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">02</span>
                      <span>3D Model Preview</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">03</span>
                      <span>Era and World Specific Models</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Era Identity - 03 */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">03</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                Identity is Not Single-Layer
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Create multiple identity versions across different time periods and fictional worlds.
              </p>
            </div>
            
            {/* Era Identity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">PAST SELF</div>
                  <h3 className="text-xl font-bold mb-2">Historical Identity</h3>
                  <p className="text-muted-foreground">
                    Archive your past selves and how you've evolved over time.
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">PRESENT SELF</div>
                  <h3 className="text-xl font-bold mb-2">Current Identity</h3>
                  <p className="text-muted-foreground">
                    Define who you are right now with all your current abilities and traits.
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">FUTURE SELF</div>
                  <h3 className="text-xl font-bold mb-2">Aspirational Identity</h3>
                  <p className="text-muted-foreground">
                    Create the version of yourself you want to become in the future.
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">ALTERNATE SELF</div>
                  <h3 className="text-xl font-bold mb-2">Parallel Identity</h3>
                  <p className="text-muted-foreground">
                    Explore what-if scenarios and alternate life paths.
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">FICTIONAL SELF</div>
                  <h3 className="text-xl font-bold mb-2">Character Identity</h3>
                  <p className="text-muted-foreground">
                    Create completely fictional characters with their own abilities and worlds.
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">WORLDBOUND SELF</div>
                  <h3 className="text-xl font-bold mb-2">World-Specific Identity</h3>
                  <p className="text-muted-foreground">
                    Create identity versions that exist only within specific fictional worlds.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Repositories - 04 */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">04</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                The Three Repositories
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Three interconnected content systems that give depth to your identity.
              </p>
            </div>
            
            {/* Repository Cards */}
            <div className="space-y-12">
              {/* DCOS */}
              <Card variant="outlined">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-mono">DCOS</span>
                    <h3 className="text-3xl font-bold">Dynamic Core Operating Script</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 max-w-3xl">
                    A narrative layer where you define your identity's core logic, principles, and internal scripts. It's the foundational narrative framework for your identity.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">core.md</div>
                      <p className="text-sm text-muted-foreground">Identity definition, mission statement, core values</p>
                    </Card>
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">voice.md</div>
                      <p className="text-sm text-muted-foreground">Communication style, speech patterns, tone guidelines</p>
                    </Card>
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">principles.md</div>
                      <p className="text-sm text-muted-foreground">Philosophical beliefs, moral code, decision-making framework</p>
                    </Card>
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">manifesto.md</div>
                      <p className="text-sm text-muted-foreground">Personal mission, vision for the future, core objectives</p>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              {/* References */}
              <Card variant="outlined">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-mono">REFERENCES</span>
                    <h3 className="text-3xl font-bold">External Knowledge Library</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 max-w-3xl">
                    A structured collection of external sources that relate to your identity, including articles, videos, music, images, and other resources.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">ARTICLES</div>
                      <p className="text-sm text-muted-foreground">News, blogs, essays, academic papers</p>
                    </Card>
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">VIDEOS</div>
                      <p className="text-sm text-muted-foreground">Documentaries, interviews, tutorials</p>
                    </Card>
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">MUSIC</div>
                      <p className="text-sm text-muted-foreground">Songs, albums, podcasts, audiobooks</p>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              {/* Worlds */}
              <Card variant="outlined">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-mono">WORLDS</span>
                    <h3 className="text-3xl font-bold">Fictional Worldbuilding</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 max-w-3xl">
                    Create and manage fictional or conceptual worlds that your identities can inhabit, complete with their own rules, histories, and characteristics.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">OVERVIEW</div>
                      <p className="text-sm text-muted-foreground">World name, genre, tone, summary</p>
                    </Card>
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">TIMELINE</div>
                      <p className="text-sm text-muted-foreground">Key events, historical periods, milestones</p>
                    </Card>
                    <Card variant="outlined" className="p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">RULES</div>
                      <p className="text-sm text-muted-foreground">Physical laws, magic systems, technology limitations</p>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Ability Pool - 05 */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">05</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                Ability Pool System
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Define and manage skills, traits, and abilities with levels and categories.
              </p>
            </div>
            
            {/* Ability Categories */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Languages</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">English (Level 5)</span>
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">Spanish (Level 3)</span>
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">French (Level 2)</span>
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">Japanese (Level 1)</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Technology</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">Frontend Development (Level 4)</span>
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">UX Design (Level 3)</span>
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">3D Modeling (Level 2)</span>
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">AI Prompting (Level 4)</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Creative</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">Writing (Level 4)</span>
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">Photography (Level 3)</span>
                  <span className="px-3 py-1 border border-border rounded-sm text-sm">Music Production (Level 2)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Model - 06 */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">06</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                3D Character Models
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                  Visual representation of your identities with GLB file support for enhanced 3D model performance.
                </p>
            </div>
            
            {/* Model Display */}
            <Card variant="outlined">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3 h-96 bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-mono text-muted-foreground mb-2">3D MODEL PREVIEW</div>
                      <p className="text-muted-foreground">OBJ Model Display Area</p>
                    </div>
                  </div>
                  <div className="md:w-1/3">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">MODEL NAME</div>
                        <p className="font-medium">Oasis Prime Model</p>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">VERSION</div>
                        <p className="font-medium">V1.02</p>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">LINKED ERA</div>
                        <p className="font-medium">Present Self</p>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">FILE TYPE</div>
                        <p className="font-medium">GLB</p>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">STATUS</div>
                        <p className="font-medium">ACTIVE</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - 07 */}
      <section className="py-32 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-white/50">07</span>
                <div className="h-px flex-grow bg-white/10"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-white">
                Begin Your Identity Journey
              </h2>
              <p className="text-xl text-white/70 max-w-3xl">
                Archive who you are, who you were, and who you may become.
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="inline-block">
              <Link href="/auth/login" className="no-underline">
                <Button size="lg" className="px-10 py-8 text-lg bg-white text-black hover:bg-gray-100">
                  Create Your OasisBio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}