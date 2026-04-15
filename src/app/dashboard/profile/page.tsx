'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { ExportHistory } from '@/components/ExportHistory';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/navigation/NavigationBar';

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

export default function ProfilePage() {
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    avatarUrl: '',
    bio: '',
    website: '',
    locale: 'en',
    defaultLanguage: 'en',
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchProfile();
  }, [isLoading, user, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          username: data.profile.username || '',
          displayName: data.profile.displayName || '',
          avatarUrl: data.profile.avatarUrl || '',
          bio: data.profile.bio || '',
          website: data.profile.website || '',
          locale: data.profile.locale || 'en',
          defaultLanguage: data.profile.defaultLanguage || 'en',
        });
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfile(data.profile);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
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
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Left Navigation Bar */}
        <NavigationBar user={user} onLogout={handleLogout} />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Profile</h1>
              <p className="text-muted-foreground">Manage your personal information</p>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your public profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      required
                    />
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
                      required
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      This will be used in your public profile URL
                    </p>
                  </div>

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
                    />
                  </div>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div>
                    <label htmlFor="defaultLanguage" className="block text-sm font-medium mb-2">
                      Default Content Language
                    </label>
                    <select
                      id="defaultLanguage"
                      name="defaultLanguage"
                      value={formData.defaultLanguage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="en">English</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={saving} size="lg">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>

            <div className="mt-12">
              <ExportHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
