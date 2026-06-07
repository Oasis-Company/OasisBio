'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/navigation';
import { validateSettingsForm } from '@/lib/validation';
import NavigationBar from '@/components/navigation/NavigationBar';
import { CopyButton } from '@/components/CopyButton';

interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  locale: string;
  defaultLanguage: string;
}

interface SettingsData {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  profile: Profile | null;
  stats: {
    totalOasisBios: number;
    publicOasisBios: number;
  };
  plan: {
    name: string;
    storageLimit: number;
    storageUsed: number;
  };
}

const navItems = [
  { id: 'account', label: 'Account' },
  { id: 'profile', label: 'Profile' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'publishing', label: 'Publishing' },
  { id: 'storage', label: 'Storage' },
  { id: 'security', label: 'Security' },
  { id: 'ai-agent', label: 'AI Agent Setup' },
];

export default function SettingsPage() {
  const { user, isLoading, supabase } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('account');
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    avatarUrl: '',
    bio: '',
    website: '',
    locale: 'en',
    defaultLanguage: 'en',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [oasisBios, setOasisBios] = useState<Array<{ id: string; title: string; slug: string; visibility: string }>>([]);
  const [loadingOasisBios, setLoadingOasisBios] = useState(true);
  const [selectedOasisBioId, setSelectedOasisBioId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('universal');

  const fetchOasisBios = async () => {
    setLoadingOasisBios(true);
    try {
      const res = await fetch('/api/oasisbios');
      if (res.ok) {
        const data = await res.json();
        const publicBios = (data.oasisBios || data).filter((bio: any) => bio.visibility === 'public');
        setOasisBios(publicBios);
        if (publicBios.length > 0 && !selectedOasisBioId) {
          setSelectedOasisBioId(publicBios[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching oasis bios:', err);
    } finally {
      setLoadingOasisBios(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchSettings();
    fetchOasisBios();
  }, [isLoading, user, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch settings');
      }

      setSettingsData(data);
      if (data.profile) {
        setFormData((prev) => ({
          ...prev,
          username: data.profile.username || '',
          displayName: data.profile.displayName || '',
          avatarUrl: data.profile.avatarUrl || '',
          bio: data.profile.bio || '',
          website: data.profile.website || '',
          locale: data.profile.locale || 'en',
          defaultLanguage: data.profile.defaultLanguage || 'en',
        }));
      }
    } catch (err) {
      setError('Failed to load settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    setSaving(true);

    try {
      // Client-side validation
      const validationResult = validateSettingsForm(formData, activeSection);
      if (!validationResult.isValid) {
        const errors: { [key: string]: string } = {};
        validationResult.errors.forEach((error) => {
          errors[error.field.toLowerCase()] = error.message;
        });
        setFieldErrors(errors);
        return;
      }

      let submitData: any = {};

      if (activeSection === 'account' || activeSection === 'profile') {
        submitData = {
          section: activeSection,
          data: {
            username: formData.username,
            displayName: formData.displayName,
            avatarUrl: formData.avatarUrl,
            bio: formData.bio,
            website: formData.website,
            locale: formData.locale,
            defaultLanguage: formData.defaultLanguage,
          },
        };
      } else if (activeSection === 'security') {
        submitData = {
          section: 'security',
          data: {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          },
        };
      }

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      if (data.profile) {
        setSettingsData((prev) => prev ? { ...prev, profile: data.profile } : null);
        setFormData((prev) => ({
          ...prev,
          username: data.profile.username || '',
          displayName: data.profile.displayName || '',
          avatarUrl: data.profile.avatarUrl || '',
          bio: data.profile.bio || '',
          website: data.profile.website || '',
          locale: data.profile.locale || 'en',
          defaultLanguage: data.profile.defaultLanguage || 'en',
        }));
      }

      if (activeSection === 'security') {
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }

      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Left Navigation Bar */}
        <NavigationBar user={user} onLogout={handleLogout} />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your account, profile, defaults, publishing and storage.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-md">
                {success}
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`px-4 py-2 rounded-md whitespace-nowrap ${
                        activeSection === item.id
                          ? 'bg-black text-white'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {activeSection === 'account' && (
                    <Card variant="outlined">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono">01</span>
                          <div>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>Your basic account information</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <Input
                            type="email"
                            value={settingsData?.user?.email || ''}
                            disabled
                            className="bg-muted"
                          />
                          <p className="mt-1 text-sm text-muted-foreground">
                            Email is read-only. Contact support to change.
                          </p>
                        </div>
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium mb-2">
                            Username
                          </label>
                          <Input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="your-username"
                            error={!!fieldErrors.username}
                            errorMessage={fieldErrors.username}
                          />
                        </div>
                        <div>
                          <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                            Display Name
                          </label>
                          <Input
                            id="displayName"
                            name="displayName"
                            type="text"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="Your display name"
                            error={!!fieldErrors['display name']}
                            errorMessage={fieldErrors['display name']}
                          />
                        </div>
                        <div>
                          <label htmlFor="locale" className="block text-sm font-medium mb-2">
                            Language
                          </label>
                          <select
                            id="locale"
                            name="locale"
                            value={formData.locale}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          >
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === 'profile' && (
                    <Card variant="outlined">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono">02</span>
                          <div>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Your public profile information</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label htmlFor="avatarUrl" className="block text-sm font-medium mb-2">
                            Avatar URL
                          </label>
                          <Input
                            id="avatarUrl"
                            name="avatarUrl"
                            type="url"
                            value={formData.avatarUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/avatar.jpg"
                            error={!!fieldErrors['avatar url']}
                            errorMessage={fieldErrors['avatar url']}
                          />
                        </div>
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium mb-2">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us a little about yourself..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label htmlFor="website" className="block text-sm font-medium mb-2">
                            Website
                          </label>
                          <Input
                            id="website"
                            name="website"
                            type="url"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://your-website.com"
                            error={!!fieldErrors.website}
                            errorMessage={fieldErrors.website}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === 'preferences' && (
                    <Card variant="outlined">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono">03</span>
                          <div>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Set your default creation rules</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Preferences will be available in a future update.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === 'publishing' && (
                    <Card variant="outlined">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono">04</span>
                          <div>
                            <CardTitle>Publishing</CardTitle>
                            <CardDescription>Control your publishing settings</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Publishing settings will be available in a future update.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === 'storage' && (
                    <Card variant="outlined">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono">05</span>
                          <div>
                            <CardTitle>Storage</CardTitle>
                            <CardDescription>Manage your storage and resources</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Plan</h4>
                          <div className="flex justify-between items-center">
                            <span>Current Plan</span>
                            <span className="font-medium">{settingsData?.plan?.name || 'Free'}</span>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium mb-2">Usage</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Storage Used</span>
                              <span>{settingsData?.plan?.storageUsed || 0} MB / {settingsData?.plan?.storageLimit || 128} MB</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Characters</span>
                              <span>{settingsData?.stats?.totalOasisBios || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Public Characters</span>
                              <span>{settingsData?.stats?.publicOasisBios || 0}</span>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium mb-2">Limits</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Avatar: 512 KB</p>
                            <p>Cover: 800 KB</p>
                            <p>3D Model: 12 MB</p>
                            <p>Format: GLB</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === 'security' && (
                    <Card variant="outlined">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono">06</span>
                          <div>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your account security</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-4">Password</h4>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                                Current Password
                              </label>
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter your current password"
                                error={!!fieldErrors['current password']}
                                errorMessage={fieldErrors['current password']}
                              />
                            </div>
                            <div>
                              <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                                New Password
                              </label>
                              <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                                error={!!fieldErrors['new password']}
                                errorMessage={fieldErrors['new password']}
                              />
                            </div>
                            <div>
                              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                Confirm New Password
                              </label>
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                                error={!!fieldErrors['confirm password']}
                                errorMessage={fieldErrors['confirm password']}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === 'ai-agent' && (
                    <Card variant="outlined">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono">07</span>
                          <div>
                            <CardTitle>AI Agent Setup</CardTitle>
                            <CardDescription>Connect your AI agents to your OasisBio identity</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {loadingOasisBios ? (
                          <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                            <p>Loading characters...</p>
                          </div>
                        ) : oasisBios.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-4">🤖</div>
                            <h3 className="text-lg font-semibold mb-2">No public characters yet</h3>
                            <p className="text-muted-foreground mb-4">
                              Publish a character first to get your Fetch URL
                            </p>
                            <Button asChild>
                              <a href="/dashboard/oasisbios">Go to My Characters</a>
                            </Button>
                          </div>
                        ) : (
                          <>
                            {/* Character Selector */}
                            <div>
                              <label htmlFor="oasisBioSelect" className="block text-sm font-medium mb-2">
                                Select your character
                              </label>
                              <select
                                id="oasisBioSelect"
                                value={selectedOasisBioId}
                                onChange={(e) => setSelectedOasisBioId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              >
                                {oasisBios.map((bio) => (
                                  <option key={bio.id} value={bio.id}>
                                    {bio.title}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Fetch URL Display */}
                            {selectedOasisBioId && (() => {
                              const selectedBio = oasisBios.find(b => b.id === selectedOasisBioId);
                              const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://oasisbio.oasiscompany.org'}/api/context/${selectedBio?.slug}`;
                              return (
                                <div>
                                  <label htmlFor="fetchUrl" className="block text-sm font-medium mb-2">
                                    Your Fetch URL
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <div id="fetchUrl" className="flex-1 bg-muted px-3 py-2 rounded-md font-mono text-sm overflow-x-auto" role="textbox" aria-label="Fetch URL">
                                      {fetchUrl}
                                    </div>
                                    <CopyButton value={fetchUrl} label="Copy" successMessage="Fetch URL copied!" />
                                  </div>
                                </div>
                              );
                            })()}

                            <div className="border-t border-gray-200 pt-6">
                              {/* Template Selector */}
                              <div className="mb-4">
                                <fieldset>
                                  <legend className="block text-sm font-medium mb-2">
                                    Quick Setup (select your AI tool)
                                  </legend>
                                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Template selector">
                                    {[
                                      { id: 'universal', label: 'Universal' },
                                      { id: 'chatgpt_claude', label: 'ChatGPT / Claude' },
                                      { id: 'cursor_windsurf', label: 'Cursor / Windsurf' },
                                      { id: 'oneline', label: 'One-Line' },
                                    ].map((template) => (
                                      <button
                                        key={template.id}
                                        type="button"
                                        onClick={() => setSelectedTemplate(template.id)}
                                        role="radio"
                                        aria-checked={selectedTemplate === template.id}
                                        aria-label={`Select ${template.label} template`}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                                          selectedTemplate === template.id
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                      >
                                        {template.label}
                                      </button>
                                    ))}
                                  </div>
                                </fieldset>
                              </div>

                              {/* Prompt Preview */}
                              {selectedOasisBioId && (() => {
                                const selectedBio = oasisBios.find(b => b.id === selectedOasisBioId);
                                const slug = selectedBio?.slug || '{your-slug}';
                                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oasisbio.oasiscompany.org';

                                const templates: Record<string, string> = {
                                  universal: `Before answering, fetch my identity context:
curl -s ${baseUrl}/api/context/${slug} | jq -r '.summary, .eras[], .abilities[]'
Use this context to personalize your response.`,
                                  chatgpt_claude: `My identity context is published at:
${baseUrl}/api/context/${slug}

Please fetch and read it before answering. Reference my background where relevant.`,
                                  cursor_windsurf: `// User identity context (OasisBio):
// Fetch: GET ${baseUrl}/api/context/${slug}
// Use this to understand the user's background, preferences, and current projects.`,
                                  oneline: `OasisBio context: ${baseUrl}/api/context/${slug}`,
                                };

                                const prompt = templates[selectedTemplate] || templates.universal;
                                return (
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <label className="block text-sm font-medium">
                                        Copy this prompt
                                      </label>
                                      <CopyButton value={prompt} label="Copy" successMessage="Prompt copied!" />
                                    </div>
                                    <pre className="bg-muted p-4 rounded-md text-sm font-mono whitespace-pre-wrap overflow-x-auto" role="textbox" aria-label="Prompt preview">
                                      {prompt}
                                    </pre>
                                  </div>
                                );
                              })()}

                              {/* How it works */}
                              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-sm mb-2">How it works:</h4>
                                <ol className="text-sm text-muted-foreground space-y-1">
                                  <li>1. Select your character above</li>
                                  <li>2. Choose your AI tool</li>
                                  <li>3. Copy the prompt and paste into your AI</li>
                                  <li>4. Your AI now knows your identity context!</li>
                                </ol>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {(activeSection === 'account' || activeSection === 'profile' || activeSection === 'security') && (
                    <div className="flex justify-end">
                      <Button type="submit" disabled={saving} size="lg">
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </form>
              </div>

              <div className="lg:w-72">
                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-wider">System Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Plan</span>
                      <span className="font-medium">{settingsData?.plan?.name || 'Free'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Characters</span>
                      <span className="font-medium">{settingsData?.stats?.totalOasisBios || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Public Characters</span>
                      <span className="font-medium">{settingsData?.stats?.publicOasisBios || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Storage</span>
                      <span className="font-medium">{settingsData?.plan?.storageUsed || 0} MB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Model Format</span>
                      <span className="font-medium">GLB</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Last Updated</span>
                        <span className="font-medium text-sm">
                          {settingsData?.user?.createdAt ? formatDate(settingsData.user.createdAt) : '-'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
