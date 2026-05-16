# Supabase GitHub OAuth Setup Guide

## Overview

This guide provides step-by-step instructions for configuring GitHub OAuth authentication with Supabase. By integrating GitHub OAuth, you can enable users to sign in to your application using their GitHub accounts, leveraging Supabase's authentication system.

## Prerequisites

Before you begin, ensure you have the following:

- A Supabase project created at [supabase.com](https://supabase.com)
- A GitHub account with access to GitHub Developer Settings

## GitHub OAuth App Configuration

### Step 1: Create a New GitHub OAuth App

1. Navigate to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on **OAuth Apps** in the left sidebar
3. Click the **New OAuth App** button

### Step 2: Configure Application Details

Fill in the following fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Application Name** | A descriptive name for your OAuth app | `OasisBio App` |
| **Homepage URL** | Your application's homepage URL | `https://oasisbio.oasiscompany.org` |
| **Authorization callback URL** | The redirect URL after authentication | `https://your-project.supabase.co/auth/v1/callback` |

> **Important**: The Authorization callback URL must match exactly with the redirect URL configured in Supabase. You can find your Supabase callback URL in the Supabase Dashboard under **Authentication > URL Configuration**.

### Step 3: Obtain Credentials

After creating the OAuth app:

1. Click on your newly created OAuth app to view its details
2. Copy the **Client ID** displayed on the page
3. Generate a new **Client Secret** by clicking **Generate a new client secret**
4. Securely store both values (you will need them for Supabase configuration)

## Supabase GitHub Provider Configuration

### Step 1: Access Supabase Dashboard

1. Log in to your Supabase project at [supabase.com](https://supabase.com)
2. Select your project from the dashboard

### Step 2: Navigate to GitHub Provider Settings

1. Go to **Authentication** in the left sidebar
2. Click on **Providers**
3. Find and click on **GitHub** in the provider list

### Step 3: Enable and Configure GitHub Provider

1. Toggle the **Enable GitHub provider** switch to ON
2. Fill in the following fields:

| Field | Value |
|-------|-------|
| **Client ID** | Paste the Client ID from your GitHub OAuth App |
| **Client Secret** | Paste the Client Secret from your GitHub OAuth App |
| **Redirect URL** | Verify this matches the callback URL in your GitHub OAuth App settings |

3. Click **Save** to apply the configuration

## Environment Variables

Configure the following environment variables in your application:

```bash
# GitHub OAuth credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

For Supabase client configuration, ensure your `.env` file includes:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing Steps

### Verify OAuth Flow

1. Start your application locally
2. Navigate to your login page
3. Click the "Sign in with GitHub" button
4. You should be redirected to GitHub's authorization page
5. Authorize the application
6. You should be redirected back to your application as an authenticated user

### Debugging Tips

- Verify that the callback URL in GitHub exactly matches the redirect URL in Supabase (including trailing slashes)
- Ensure the GitHub OAuth App is owned by the same GitHub account used for testing
- Check the Supabase logs under **Authentication > Logs** for any authentication errors

## Troubleshooting

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `redirect_uri_mismatch` | Callback URLs do not match | Ensure the GitHub OAuth App callback URL matches Supabase's redirect URL exactly |
| `Application not authorized` | OAuth App not approved | For GitHub Enterprise, ensure the OAuth App is authorized for your organization |
| `Client ID/Secret invalid` | Incorrect credentials | Verify you copied the Client ID and Secret correctly from GitHub |
| `Provider not enabled` | GitHub provider disabled | Go to Supabase Authentication > Providers and enable GitHub |

### Additional Debugging Steps

1. **Check Supabase Logs**: Navigate to **Authentication > Logs** to view detailed error messages
2. **Verify URL Configuration**: Ensure **Authentication > URL Configuration** has the correct site URL and redirect URLs
3. **Clear Browser Cache**: Sometimes cached credentials can cause issues; try clearing your browser cache or using incognito mode

### Support Resources

- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Supabase Discord Community](https://discord.gg/supabase)
