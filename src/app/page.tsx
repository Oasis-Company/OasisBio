import React from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OasisBio - Your AI-Powered Identity Passport',
  description: 'Create one portable, AI-readable identity. Stop reintroducing yourself to every app and AI. Build your AI identity context once, use it everywhere.',
  keywords: [
    'AI identity passport',
    'identity context infrastructure',
    'machine-readable identity',
    'AI-ready profile',
    'portable identity',
    'open identity protocol',
    'structured identity',
    'OAuth identity context',
    'AI context layer'
  ],
  openGraph: {
    title: 'OasisBio - Your AI-Powered Identity Passport',
    description: 'Create one portable, AI-readable identity. Stop reintroducing yourself to every app and AI.',
    type: 'website',
    siteName: 'OasisBio',
  },
  twitter: {
    title: 'OasisBio - AI Identity Passport',
    description: 'Stop reintroducing yourself to every AI. Create your identity once, use it everywhere.',
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
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">AI IDENTITY PASSPORT</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">MACHINE-READABLE CONTEXT</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">OPEN IDENTITY PROTOCOL</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">OAUTH IDENTITY CONTEXT</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-8 leading-tight tracking-tighter text-white">
              <span className="block">YOUR</span>
              <span className="block">IDENTITY</span>
              <span className="block">PASSPORT</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-16 max-w-3xl text-white/70 leading-relaxed">
              Stop reintroducing yourself to every AI and app. Create your structured identity once, and let machines understand you instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/auth/register" className="no-underline">
                <Button size="lg" className="px-8 py-6 text-lg bg-white text-black hover:bg-gray-100">
                  Create My Identity Card
                </Button>
              </Link>
              <Link href="#what-is-identity-context" className="no-underline">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg border border-white/30 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is Identity Context - 02 */}
      <section id="what-is-identity-context" className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">02</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                What is Identity Context?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                A portable, machine-readable layer that lets AI and applications understand who you are — instantly.
              </p>
            </div>

            {/* System Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Identity Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Store your structured profile with past, present, and future information so every AI gets your full context.
                  </p>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">01</span>
                      <span>AI-Readable Structured Data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">02</span>
                      <span>OAuth-Enabled Context Sharing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">03</span>
                      <span>Portable Across Applications</span>
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
                    Define your skills, traits, and capabilities as structured data that AI can understand and reference.
                  </p>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">01</span>
                      <span>Machine-Consumable Skill Profiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">02</span>
                      <span>AI-Interpretable Proficiency Levels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">03</span>
                      <span>Context-Aware Capability Matching</span>
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
                    Three interconnected content systems that provide AI with deep understanding of your identity.
                  </p>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">01</span>
                      <span>DCOS (Core Operating Scripts)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">02</span>
                      <span>References Knowledge Library</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">03</span>
                      <span>World Context Repository</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">AI Context API</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Programmatic access to identity context via REST API or OAuth for seamless AI integration.
                  </p>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">01</span>
                      <span>GET /api/context/:slug</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">02</span>
                      <span>OAuth scope: context:read</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground mt-1">03</span>
                      <span>.well-known/oasisbio.json</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement - 03 */}
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
                Stop Reintroducing Yourself
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Every time you use a new AI or app, you have to re-explain who you are. OasisBio fixes that.
              </p>
            </div>

            {/* Problem Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">PROBLEM</div>
                  <h3 className="text-xl font-bold mb-2">Repeated Context Entry</h3>
                  <p className="text-muted-foreground">
                    Every new AI session requires you to re-explain your background, preferences, and goals.
                  </p>
                </CardContent>
              </Card>

              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">PROBLEM</div>
                  <h3 className="text-xl font-bold mb-2">Fragmented Identity</h3>
                  <p className="text-muted-foreground">
                    Your information is scattered across dozens of apps with no way to share context between them.
                  </p>
                </CardContent>
              </Card>

              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">PROBLEM</div>
                  <h3 className="text-xl font-bold mb-2">No Machine Readability</h3>
                  <p className="text-muted-foreground">
                    AI cannot understand your profile data because it lacks a standardized, machine-readable format.
                  </p>
                </CardContent>
              </Card>

              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">SOLUTION</div>
                  <h3 className="text-xl font-bold mb-2">Structured Identity Context</h3>
                  <p className="text-muted-foreground">
                    Create one structured profile that AI and apps can instantly understand.
                  </p>
                </CardContent>
              </Card>

              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">SOLUTION</div>
                  <h3 className="text-xl font-bold mb-2">Portable & Shareable</h3>
                  <p className="text-muted-foreground">
                    Share your identity context across unlimited apps via OAuth or public API.
                  </p>
                </CardContent>
              </Card>

              <Card variant="outlined" className="hover:border-foreground transition-colors duration-300">
                <CardContent>
                  <div className="text-xs font-mono text-muted-foreground mb-2">SOLUTION</div>
                  <h3 className="text-xl font-bold mb-2">You Control Access</h3>
                  <p className="text-muted-foreground">
                    Decide exactly what information each app or AI can read. Full privacy control.
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
                The Three Context Repositories
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Give AI a deep understanding of who you are through structured content layers.
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
                    The foundational logic layer that defines who you are at your core. AI reads this to understand your values, communication style, and decision-making framework.
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
                    Resources that shape your identity context. AI can reference these to understand what influences your thinking and interests.
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
                    <h3 className="text-3xl font-bold">World Context Repository</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 max-w-3xl">
                    Contextual world information that shapes your identity. Whether real or fictional, AI understands your connection to these environments.
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
                AI-Readable Capabilities
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Define your skills and traits as structured data that AI can understand and leverage.
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
                Visual Identity
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Attach a visual representation to your identity context for enhanced AI understanding.
              </p>
            </div>

            {/* Model Display */}
            <Card variant="outlined">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3 h-96 bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-mono text-muted-foreground mb-2">VISUAL IDENTITY PREVIEW</div>
                      <p className="text-muted-foreground">GLB Model Display Area</p>
                    </div>
                  </div>
                  <div className="md:w-1/3">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">MODEL NAME</div>
                        <p className="font-medium">Oasis Identity Avatar</p>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">VERSION</div>
                        <p className="font-medium">V1.02</p>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">FORMAT</div>
                        <p className="font-medium">GLB (GLTF Binary)</p>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">USE CASE</div>
                        <p className="font-medium">AI Avatar Representation</p>
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
                Get Your AI Identity Passport
              </h2>
              <p className="text-xl text-white/70 max-w-3xl">
                Stop reintroducing yourself to every AI. Create your identity context once, and let machines understand you everywhere.
              </p>
            </div>

            {/* CTA Button */}
            <div className="inline-block">
              <Link href="/auth/register" className="no-underline">
                <Button size="lg" className="px-10 py-8 text-lg bg-white text-black hover:bg-gray-100">
                  Create My Identity Card
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}