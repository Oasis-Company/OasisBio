'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/navigation';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function CreateOasisBioPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  // Form data
  const [identityMode, setIdentityMode] = useState('real');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [placeOfOrigin, setPlaceOfOrigin] = useState('');
  const [currentEra, setCurrentEra] = useState('');
  const [species, setSpecies] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  const handleNext = () => {
    if (step < 6) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = () => {
    // Submit form data to API
    console.log('Submit form data');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Create New OasisBio</h1>
          <Button asChild>
            <a href="/dashboard">Cancel</a>
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4, 5, 6].map((stepNum) => (
            <div key={stepNum} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono ${stepNum <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {stepNum}
              </div>
              <div className="mt-2 text-xs font-mono text-center">
                {stepNum === 1 && 'Identity'}
                {stepNum === 2 && 'Era'}
                {stepNum === 3 && 'Abilities'}
                {stepNum === 4 && 'Repositories'}
                {stepNum === 5 && 'Model'}
                {stepNum === 6 && 'Publish'}
              </div>
              {stepNum < 6 && (
                <div className={`flex-1 h-1 mx-2 ${stepNum < step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Identity Mode */}
        {step === 1 && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Step 1: Choose Identity Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Select the type of identity you want to create.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'real', label: 'Real', description: 'Your actual self' },
                    { value: 'fictional', label: 'Fictional', description: 'A character you create' },
                    { value: 'hybrid', label: 'Hybrid', description: 'A mix of real and fictional' },
                    { value: 'future', label: 'Future', description: 'Your future self' },
                    { value: 'alternate', label: 'Alternate', description: 'A parallel version of you' },
                  ].map((mode) => (
                    <div key={mode.value} className="border border-border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors">
                      <input
                        type="radio"
                        id={`mode-${mode.value}`}
                        name="identityMode"
                        value={mode.value}
                        checked={identityMode === mode.value}
                        onChange={(e) => setIdentityMode(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`mode-${mode.value}`} className="font-medium">
                        {mode.label}
                      </label>
                      <p className="text-sm text-muted-foreground ml-6">
                        {mode.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Step 2: Name Your OasisBio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter a name for your OasisBio"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium mb-1">
                    Slug (URL)
                  </label>
                  <Input
                    id="slug"
                    placeholder="Enter a unique URL slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium mb-1">
                    Tagline (Optional)
                  </label>
                  <Input
                    id="tagline"
                    placeholder="A short description of this identity"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Basic Info */}
        {step === 3 && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Step 3: Basic Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium mb-1">
                      Birth Date (Optional)
                    </label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium mb-1">
                      Gender (Optional)
                    </label>
                    <Input
                      id="gender"
                      placeholder="Enter gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="pronouns" className="block text-sm font-medium mb-1">
                      Pronouns (Optional)
                    </label>
                    <Input
                      id="pronouns"
                      placeholder="Enter pronouns"
                      value={pronouns}
                      onChange={(e) => setPronouns(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="placeOfOrigin" className="block text-sm font-medium mb-1">
                      Place of Origin (Optional)
                    </label>
                    <Input
                      id="placeOfOrigin"
                      placeholder="Enter place of origin"
                      value={placeOfOrigin}
                      onChange={(e) => setPlaceOfOrigin(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="currentEra" className="block text-sm font-medium mb-1">
                      Current Era (Optional)
                    </label>
                    <Input
                      id="currentEra"
                      placeholder="Enter current era"
                      value={currentEra}
                      onChange={(e) => setCurrentEra(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="species" className="block text-sm font-medium mb-1">
                      Species (Optional)
                    </label>
                    <Input
                      id="species"
                      placeholder="Enter species"
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">
                    Status (Optional)
                  </label>
                  <Input
                    id="status"
                    placeholder="Enter status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter a description of this identity"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Abilities */}
        {step === 4 && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Step 4: Build Your Ability Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Add abilities to your OasisBio. You can add custom abilities or choose from presets.
              </p>
              <div className="border border-border rounded-md p-4 mb-4">
                <h3 className="font-medium mb-2">Add New Ability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Ability Name" />
                  <Input placeholder="Category" />
                  <Input placeholder="Level (1-5)" type="number" min="1" max="5" />
                  <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="custom">Custom</option>
                    <option value="official">Official</option>
                  </select>
                </div>
                <Button className="mt-4">Add Ability</Button>
              </div>
              <div className="border border-border rounded-md p-4">
                <h3 className="font-medium mb-2">Your Abilities</h3>
                <p className="text-muted-foreground">No abilities added yet.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Repositories */}
        {step === 5 && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Step 5: Build Your Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">DCOS (Dynamic Core Operating Script)</h3>
                  <p className="text-muted-foreground mb-4">
                    Create core files that define your identity's narrative.
                  </p>
                  <Button>Add DCOS File</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2">References</h3>
                  <p className="text-muted-foreground mb-4">
                    Add external references that relate to your identity.
                  </p>
                  <Button>Add Reference</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Worlds</h3>
                  <p className="text-muted-foreground mb-4">
                    Create worlds that your identity belongs to.
                  </p>
                  <Button>Add World</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Model */}
        {step === 6 && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Step 6: Upload 3D Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upload an OBJ file to represent your identity visually.
              </p>
              <div className="border border-dashed border-border rounded-md p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Drag and drop your OBJ file here, or click to browse
                </p>
                <Button>Select File</Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports .obj files only
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 7: Publish */}
        {step === 7 && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Step 7: Preview & Publish</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Review your OasisBio and publish it to make it public.
              </p>
              <div className="border border-border rounded-md p-4 mb-4">
                <h3 className="font-medium mb-2">OasisBio Preview</h3>
                <p className="text-muted-foreground">Preview will appear here</p>
              </div>
              <div className="flex items-center space-x-4">
                <input type="checkbox" id="public" className="mr-2" />
                <label htmlFor="public">Make this OasisBio public</label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {step < 7 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Publish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
