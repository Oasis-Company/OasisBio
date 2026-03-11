import React from 'react';
import { Button } from '@/components/Button';

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-white"></div>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-white col-span-12"></div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-12 leading-tight tracking-tighter">
              Identity is not flat.<br />
              Biography is not enough.
            </h1>
            <p className="text-xl md:text-2xl mb-16 text-gray-300 leading-relaxed max-w-2xl mx-auto">
              A person can be a timeline. A world can begin with a profile.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Create Your OasisBio
            </Button>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-32 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Our Principles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Identity as a Spectrum</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We believe identity is not a fixed state but a spectrum of possibilities. People evolve, grow, and imagine different versions of themselves across time and dimensions.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Narrative Freedom</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Everyone should have the freedom to create and tell their own stories, whether they're documenting real experiences or building fictional worlds.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Digital Permanence</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We're building a system that preserves your digital identity across time, ensuring your stories and creations remain accessible for years to come.
                  </p>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Creative Expression</h3>
                  <p className="text-gray-300 leading-relaxed">
                    OasisBio provides tools for creative expression, allowing you to visualize your identity through 3D models, worlds, and comprehensive ability systems.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Community and Discovery</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We're creating a community where people can discover and connect with others through shared identities, worlds, and creative expression.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Technological Innovation</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We leverage cutting-edge technology to provide a seamless experience for creating, managing, and sharing your digital identity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Text */}
      <section className="py-32 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">The Manifesto</h2>
            
            <div className="space-y-8 text-gray-300 leading-relaxed">
              <p className="text-xl">
                In the digital age, our identities have become fragmented across platforms and profiles. We're reduced to static snapshots, stripped of context, history, and potential.
              </p>
              <p>
                OasisBio was created to challenge this limitation. We believe that identity is a dynamic, evolving narrative—one that deserves a system capable of capturing its full complexity.
              </p>
              <p>
                We envision a world where people can document their past selves, express their present identities, and imagine their future possibilities—all within a single, cohesive system.
              </p>
              <p>
                We believe that fictional characters, alternate selves, and future projections are just as valid as our current identities. They represent the boundless creativity of the human imagination.
              </p>
              <p>
                We are building a platform where worlds can be created, abilities can be defined, and stories can be told—where identity is not just a profile, but a living, breathing universe.
              </p>
              <p>
                Join us in redefining what it means to have a digital identity. Together, we can build a system that honors the full spectrum of human experience and imagination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Identity Evolution</h2>
            <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
              Be part of a community that's reimagining digital identity for the future.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Create Your OasisBio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}