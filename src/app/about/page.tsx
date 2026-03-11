import React from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">What is OasisBio?</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600">
              A modular identity system for people, characters, worlds, and future selves.
            </p>
          </div>
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">The Identity Evolution</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-bold mb-4">Why Identity Should Be Expandable</h3>
                <p className="text-gray-700 mb-4">
                  Traditional profile systems limit you to a single static identity. But people are complex, multifaceted beings with past, present, and future selves.
                </p>
                <p className="text-gray-700 mb-4">
                  OasisBio recognizes that identity is not a fixed state but a spectrum of possibilities. It allows you to explore different versions of yourself across time and dimensions.
                </p>
                <p className="text-gray-700">
                  Whether you want to document your personal growth, create fictional characters, or imagine your future self, OasisBio provides the framework to do so.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Why One Profile Is Not Enough</h3>
                <p className="text-gray-700 mb-4">
                  A single profile can't capture the full breadth of who you are. You might be a professional by day, an artist by night, and a dreamer always.
                </p>
                <p className="text-gray-700 mb-4">
                  OasisBio lets you create multiple identity versions—past, present, future, alternate, and fictional—all within a single system.
                </p>
                <p className="text-gray-700">
                  This approach gives you the freedom to express different aspects of your identity without being confined to a single narrative.
                </p>
              </div>
            </div>

            {/* Core Concepts */}
            <h2 className="text-3xl font-bold mb-8 text-center">Core Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Cross-Era Identity</CardTitle>
                  <CardDescription>Multiple identity versions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Past Self</li>
                    <li>• Present Self</li>
                    <li>• Future Self</li>
                    <li>• Alternate Self</li>
                    <li>• Fictional Self</li>
                    <li>• Worldbound Self</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Ability Pool</CardTitle>
                  <CardDescription>Skill management system</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Custom abilities</li>
                    <li>• Official presets</li>
                    <li>• Skill levels (1-5)</li>
                    <li>• Categorized skills</li>
                    <li>• Era-specific abilities</li>
                    <li>• World-bound skills</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Repositories</CardTitle>
                  <CardDescription>Content management</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• DCOS (Core scripts)</li>
                    <li>• References library</li>
                    <li>• Worldbuilding repository</li>
                    <li>• Version control</li>
                    <li>• Markdown support</li>
                    <li>• Draft/published status</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>3D Model Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Upload and preview 3D models in OBJ format, with support for materials and textures.
                  </p>
                  <p className="text-gray-700">
                    Visualize your identity across different eras and worlds with custom 3D representations.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Worldbuilding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Create and manage fictional worlds with detailed timelines, rules, and factions.
                  </p>
                  <p className="text-gray-700">
                    Bind your identities to specific worlds, creating a cohesive narrative across dimensions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Public Presence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Generate beautiful public pages for your OasisBios with era-switching functionality.
                  </p>
                  <p className="text-gray-700">
                    Showcase your identities, abilities, and worlds to the public with a professional presentation.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Flexible Identity System</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Create any type of identity—real, fictional, hybrid, future, or alternate.
                  </p>
                  <p className="text-gray-700">
                    Define your identity with customizable fields that adapt to your needs, whether you're documenting a real person or creating a fictional character.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Build Your Identity Beyond Time?</h2>
            <p className="text-xl mb-10 text-gray-600">
              Start creating your OasisBio today and explore the infinite possibilities of your identity.
            </p>
            <Button size="lg" asChild>
              <a href="/create">Create Your OasisBio</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}