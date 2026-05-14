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
              Open identity context infrastructure for the AI era. Build once, use everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">The Problem We Solve</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-red-600">The Old Way</h3>
                <p className="text-gray-700 mb-4">
                  Every time you interact with a new AI assistant or application, you have to re-explain who you are. Your background, preferences, goals, communication style — all lost.
                </p>
                <p className="text-gray-700 mb-4">
                  Your information is scattered across dozens of platforms with no standardized way to share context between them.
                </p>
                <p className="text-gray-700">
                  AI systems can't understand your profile data because it lacks a machine-readable format.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-600">The OasisBio Way</h3>
                <p className="text-gray-700 mb-4">
                  Create one structured identity context that AI and applications can instantly understand. No more repeated introductions.
                </p>
                <p className="text-gray-700 mb-4">
                  Your identity travels with you across every AI and app via OAuth or public API. Control exactly what each service can read.
                </p>
                <p className="text-gray-700">
                  Machine-readable structured data means AI can finally understand who you are and how you think.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Concepts */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Core Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Identity Context</CardTitle>
                  <CardDescription>Machine-readable profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Structured data format</li>
                    <li>• Portable across platforms</li>
                    <li>• OAuth-enabled sharing</li>
                    <li>• Privacy controlled</li>
                    <li>• Instant AI comprehension</li>
                    <li>• Version tracking</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>AI Context API</CardTitle>
                  <CardDescription>Programmatic access</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• GET /api/context/:slug</li>
                    <li>• OAuth scope: context:read</li>
                    <li>• .well-known/oasisbio.json</li>
                    <li>• RESTful integration</li>
                    <li>• Real-time updates</li>
                    <li>• Rate limited & secure</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Context Repositories</CardTitle>
                  <CardDescription>Deep identity layers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• DCOS (Core Scripts)</li>
                    <li>• References Library</li>
                    <li>• World Context</li>
                    <li>• Ability Pool</li>
                    <li>• Version control</li>
                    <li>• Markdown support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">What You Can Build</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>For AI Assistants</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Share your identity context with ChatGPT, Copilot, or any AI assistant. They instantly understand your background, preferences, and communication style.
                  </p>
                  <p className="text-gray-700">
                    No more repeated "About me" messages. Your AI knows you from day one.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>For Application Developers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Integrate OAuth-based identity context into your app. Users log in once and your app receives their structured profile automatically.
                  </p>
                  <p className="text-gray-700">
                    Build smarter personalization without asking users to fill out lengthy forms.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>For Content Creators</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Your audience can access your creator context instantly. AI-powered tools understand your brand, style, and audience without manual configuration.
                  </p>
                  <p className="text-gray-700">
                    Streamline content workflows with AI that truly understands your creative identity.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>For Teams & Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Enable team members to share structured identity contexts. Onboarding new AI tools takes seconds, not days of configuration.
                  </p>
                  <p className="text-gray-700">
                    Maintain institutional knowledge in a machine-readable format that AI can leverage.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Technical Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>REST API</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Access identity context via simple REST endpoints. Perfect for any platform or programming language.
                  </p>
                  <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                    GET /api/context/{'{slug}'}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>OAuth 2.0 + OIDC</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Integrate with enterprise identity systems. Use standard OAuth scopes for fine-grained access control.
                  </p>
                  <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                    scope: context:read
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Well-Known Endpoint</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Discover identity context through a standardized .well-known endpoint. AI agents can find your context automatically.
                  </p>
                  <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                    /.well-known/oasisbio.json
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Privacy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Users control exactly what information each app or AI can access. Fine-grained permissions at the field level.
                  </p>
                  <p className="text-gray-700">
                    No data shared without explicit consent. Full audit logging.
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
            <h2 className="text-3xl font-bold mb-6">Ready to Build Your AI Identity?</h2>
            <p className="text-xl mb-10 text-gray-600">
              Stop reintroducing yourself to every AI. Create your identity context once, use it everywhere.
            </p>
            <Button size="lg" asChild>
              <a href="/create">Create My Identity Card</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}