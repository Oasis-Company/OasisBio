import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — OasisBio',
  description: 'How OasisBio collects, uses, and protects your personal information.',
};

const LAST_UPDATED = 'April 13, 2026';
const CONTACT_EMAIL = 'oasisbiosupport@oermos.com';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Back to OasisBio
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              OasisBio (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is operated by Oasis Company (ceaserzhao). This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our
              platform at <a href="https://oasisbio.com" className="text-black underline">oasisbio.com</a> and
              any related services (collectively, the &quot;Service&quot;).
            </p>
            <p className="mt-3">
              By using the Service, you agree to the collection and use of information in accordance
              with this policy. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="font-semibold text-gray-800 mb-2">2.1 Information you provide directly</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Email address (used for passwordless authentication)</li>
              <li>Display name and username</li>
              <li>Profile information (bio, website, avatar)</li>
              <li>Character content you create (OasisBio profiles, DCOS documents, world settings, abilities, references)</li>
              <li>3D model files you upload</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.2 Information collected automatically</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Authentication session tokens (stored in cookies)</li>
              <li>Basic server logs (IP address, request timestamps, HTTP method and path) — retained for up to 30 days for security and debugging</li>
              <li>Export history (file name, size, character count)</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.3 Information from third-party OAuth integrations</h3>
            <p className="text-sm">
              If you authorize a third-party application via &quot;Continue with Oasis&quot;, we record which
              application was authorized, the granted scopes, and token metadata. We do not share your
              data with third-party apps beyond what you explicitly authorize.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>To provide, operate, and maintain the Service</li>
              <li>To authenticate you and manage your account</li>
              <li>To store and display the content you create</li>
              <li>To enable the OAuth provider feature (&quot;Continue with Oasis&quot;)</li>
              <li>To respond to your support requests</li>
              <li>To detect and prevent fraud, abuse, and security incidents</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-3 text-sm font-medium">
              We do not sell your personal data to third parties. We do not use your content for
              advertising or train AI models on your private content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Storage and Third-Party Services</h2>
            <p className="text-sm mb-3">
              We use the following third-party infrastructure providers. Your data may be stored on
              servers operated by these providers:
            </p>
            <div className="border border-gray-100 rounded-xl overflow-hidden text-sm">
              {[
                { provider: 'Supabase', purpose: 'Database (PostgreSQL), authentication, and image storage', link: 'https://supabase.com/privacy' },
                { provider: 'Cloudflare', purpose: '3D model storage (R2), CDN, and Pages hosting', link: 'https://www.cloudflare.com/privacypolicy/' },
              ].map(({ provider, purpose, link }, i) => (
                <div key={provider} className={`flex items-start gap-4 px-4 py-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <span className="font-medium text-gray-800 w-28 flex-shrink-0">{provider}</span>
                  <span className="text-gray-600 flex-1">{purpose}</span>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black text-xs flex-shrink-0">Privacy Policy ↗</a>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500">
              These providers act as data processors on our behalf and are contractually bound to
              protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies and Session Storage</h2>
            <p className="text-sm mb-3">We use the following cookies and browser storage:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Authentication cookies</strong> — set by Supabase Auth to maintain your login session. These are strictly necessary and cannot be disabled.</li>
              <li><strong>Session storage</strong> — used temporarily during OAuth PKCE flows to store the code verifier. Cleared when you close the browser tab.</li>
            </ul>
            <p className="mt-3 text-sm">
              We do not use advertising cookies, tracking pixels, or third-party analytics cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Public Content</h2>
            <p className="text-sm">
              Content you choose to make public (OasisBio profiles with visibility set to &quot;public&quot;,
              public worlds) is accessible to anyone on the internet, including search engines. You
              can change visibility to &quot;private&quot; at any time from your dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="text-sm mb-3">
              Regardless of your location, you have the following rights with respect to your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Access</strong> — request a copy of the data we hold about you</li>
              <li><strong>Correction</strong> — update inaccurate information via your profile settings</li>
              <li><strong>Deletion</strong> — delete your account and all associated data from your dashboard settings. Account deletion is permanent and irreversible.</li>
              <li><strong>Export</strong> — export all your character data as a ZIP file at any time from your dashboard</li>
              <li><strong>Revoke OAuth access</strong> — revoke any third-party app&apos;s access to your account from your settings</li>
            </ul>
            <p className="mt-3 text-sm">
              For requests that cannot be completed through the platform, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline">{CONTACT_EMAIL}</a>.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              <strong>GDPR (EU/EEA users):</strong> You additionally have the right to data portability,
              the right to restrict processing, and the right to lodge a complaint with your local
              supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Account data is retained until you delete your account</li>
              <li>Server logs are retained for up to 30 days</li>
              <li>Audit logs (publish/unpublish actions) are retained for 12 months</li>
              <li>After account deletion, all personal data is permanently removed within 30 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-sm">
              The Service is not directed to children under the age of 13. We do not knowingly collect
              personal information from children under 13. If you believe a child under 13 has provided
              us with personal information, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Security</h2>
            <p className="text-sm">
              We implement industry-standard security measures including encrypted connections (HTTPS),
              bcrypt hashing for OAuth client secrets, JWT-signed access tokens, and Row Level Security
              on all database tables. However, no method of transmission over the internet is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Changes to This Policy</h2>
            <p className="text-sm">
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by updating the &quot;Last updated&quot; date at the top of this page. Continued use of
              the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact</h2>
            <p className="text-sm">
              For privacy-related questions or requests, contact Oasis Company at:
            </p>
            <p className="mt-2 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline font-medium">{CONTACT_EMAIL}</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
