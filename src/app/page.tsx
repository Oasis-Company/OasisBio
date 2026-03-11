import React from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-black"></div>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-black col-span-12"></div>
          ))}
        </div>
        
        {/* Timeline Lines */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-black opacity-20"></div>
        </div>
        <div className="absolute inset-0 flex justify-center">
          <div className="h-full w-px bg-black opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tighter">
              Build an identity<br />beyond time.
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-600 leading-relaxed">
              OasisBio is a modular identity system for people, characters, worlds, and future selves.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg">
                Create Your OasisBio
              </Button>
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                Explore Identities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              The Identity Evolution
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Move beyond static profiles. Build a living, breathing identity system that grows with you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">Cross-Era Identity</CardTitle>
                <CardDescription className="text-gray-600">
                  Multiple identity versions across time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li>• Past, Present, Future Selves</li>
                  <li>• Alternate and Fictional Identities</li>
                  <li>• Worldbound Character Versions</li>
                  <li>• Timeline-Based Evolution</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">Ability Pool</CardTitle>
                <CardDescription className="text-gray-600">
                  Comprehensive skill management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li>• Custom and Official Abilities</li>
                  <li>• Skill Levels (1-5)</li>
                  <li>• Categorized Skill System</li>
                  <li>• Era and World Binding</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">Repositories</CardTitle>
                <CardDescription className="text-gray-600">
                  Three interconnected content systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li>• DCOS (Core Identity Scripts)</li>
                  <li>• References Library</li>
                  <li>• Worldbuilding Repository</li>
                  <li>• Version Control and History</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">3D Model Support</CardTitle>
                <CardDescription className="text-gray-600">
                  Visual identity representation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li>• OBJ File Uploads</li>
                  <li>• 3D Model Preview</li>
                  <li>• Era-Specific Models</li>
                  <li>• World-Bound Visuals</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">Worldbuilding</CardTitle>
                <CardDescription className="text-gray-600">
                  Create and manage fictional worlds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li>• Multiple World Creation</li>
                  <li>• Timeline and Rules</li>
                  <li>• Factions and Geography</li>
                  <li>• Character-World Binding</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">Public Presence</CardTitle>
                <CardDescription className="text-gray-600">
                  Showcase your identities to the world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li>• Customizable Public Pages</li>
                  <li>• Era-Switching Interface</li>
                  <li>• Ability Visualization</li>
                  <li>• 3D Model Viewer</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
              Begin Your Identity Journey
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300">
              Archive who you are, who you were, and who you may become.
            </p>
            <Button size="lg" className="px-8 py-6 text-lg bg-white text-black hover:bg-gray-100">
              Create Your OasisBio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}