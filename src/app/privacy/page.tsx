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
        <p className="text-sm text-gray-400 mb-4">Last updated: {LAST_UPDATED}</p>

        {/* Regional notice banner */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-12 text-sm text-gray-600">
          This policy applies globally. Additional rights for residents of the{' '}
          <a href="#gdpr" className="text-black underline">European Union / EEA</a>,{' '}
          <a href="#ccpa" className="text-black underline">California (USA)</a>,{' '}
          <a href="#lgpd" className="text-black underline">Brazil</a>, and{' '}
          <a href="#pipl" className="text-black underline">China</a> are described in dedicated sections below.
        </div>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          {/* ── 1. Introduction ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              OasisBio (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is operated by Oasis Company (ceaserzhao).
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our platform at{' '}
              <a href="https://oasisbio.oasiscompany.org" className="text-black underline">oasisbio.oasiscompany.org</a>{' '}
              and any related services (collectively, the &quot;Service&quot;).
            </p>
            <p className="mt-3">
              By using the Service, you agree to the collection and use of information in
              accordance with this policy. If you do not agree, please do not use the Service.
            </p>
          </section>

          {/* ── 2. Information We Collect ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="font-semibold text-gray-800 mb-2">2.1 Information you provide directly</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Email address (used for passwordless authentication)</li>
              <li>Display name and username</li>
              <li>Profile information (bio, website, avatar image)</li>
              <li>Character content you create (OasisBio profiles, DCOS documents, world settings, abilities, references)</li>
              <li>3D model files you upload</li>
              <li>Support communications you send to us</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.2 Information collected automatically</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Authentication session tokens (stored in cookies — strictly necessary)</li>
              <li>Server logs: IP address, request timestamps, HTTP method and path — retained for up to 30 days for security and debugging</li>
              <li>Export history (file name, size, character count)</li>
              <li>Audit logs of significant actions (publish/unpublish) — retained for 12 months</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.3 Information from OAuth integrations</h3>
            <p className="text-sm">
              If you authorize a third-party application via &quot;Continue with Oasis&quot;, we record
              which application was authorized, the granted scopes, and token metadata. We do not
              share your data with third-party apps beyond what you explicitly authorize on the
              consent screen.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.4 Information we do NOT collect</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Passwords (we use passwordless OTP authentication)</li>
              <li>Payment information (the Service is currently free)</li>
              <li>Precise geolocation</li>
              <li>Device fingerprints or advertising identifiers</li>
              <li>Behavioral tracking across third-party websites</li>
            </ul>
          </section>

          {/* ── 3. Legal Basis for Processing ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Legal Basis for Processing</h2>
            <p className="text-sm mb-3">
              We process your personal data on the following legal bases (applicable under GDPR,
              LGPD, and similar frameworks):
            </p>
            <div className="border border-gray-100 rounded-xl overflow-hidden text-sm">
              {[
                { basis: 'Contract performance', purpose: 'Providing the Service, authentication, storing your content, enabling OAuth' },
                { basis: 'Legitimate interests', purpose: 'Security monitoring, fraud prevention, server logs, audit trails' },
                { basis: 'Legal obligation', purpose: 'Responding to lawful requests from authorities' },
                { basis: 'Consent', purpose: 'Any processing not covered above (we will ask explicitly)' },
              ].map(({ basis, purpose }, i) => (
                <div key={basis} className={`flex items-start gap-4 px-4 py-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <span className="font-medium text-gray-800 w-44 flex-shrink-0">{basis}</span>
                  <span className="text-gray-600">{purpose}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 4. How We Use Your Information ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>To provide, operate, and maintain the Service</li>
              <li>To authenticate you and manage your account</li>
              <li>To store and display the content you create</li>
              <li>To enable the OAuth provider feature (&quot;Continue with Oasis&quot;)</li>
              <li>To respond to your support requests</li>
              <li>To detect and prevent fraud, abuse, and security incidents</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-3 text-sm font-medium text-gray-900">
              We do not sell your personal data. We do not use your content for advertising.
              We do not train AI models on your private content.
            </p>
          </section>

          {/* ── 5. Data Storage and Third-Party Services ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Storage and Third-Party Processors</h2>
            <p className="text-sm mb-3">
              Your data is processed by the following sub-processors. All are bound by data
              processing agreements and appropriate safeguards for international data transfers:
            </p>
            <div className="border border-gray-100 rounded-xl overflow-hidden text-sm">
              {[
                {
                  provider: 'Supabase',
                  location: 'USA (AWS)',
                  purpose: 'Database (PostgreSQL), authentication, image storage',
                  link: 'https://supabase.com/privacy',
                  safeguard: 'Standard Contractual Clauses (SCCs)',
                },
                {
                  provider: 'Cloudflare',
                  location: 'Global CDN',
                  purpose: '3D model storage (R2), CDN, Pages hosting',
                  link: 'https://www.cloudflare.com/privacypolicy/',
                  safeguard: 'SCCs + Cloudflare DPA',
                },
              ].map(({ provider, location, purpose, link, safeguard }, i) => (
                <div key={provider} className={`px-4 py-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{provider}</span>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-black">Privacy Policy ↗</a>
                  </div>
                  <p className="text-gray-600 text-xs">{purpose} · {location}</p>
                  <p className="text-gray-400 text-xs mt-0.5">Transfer safeguard: {safeguard}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Data may be stored on servers located outside your country of residence. We ensure
              appropriate safeguards are in place for all international transfers.
            </p>
          </section>

          {/* ── 6. Cookies ── */}
          <section id="cookies">
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies and Session Storage</h2>
            <div className="border border-gray-100 rounded-xl overflow-hidden text-sm mb-3">
              {[
                { name: 'Authentication cookies', type: 'Strictly necessary', purpose: 'Maintain your login session (set by Supabase Auth). Cannot be disabled.' },
                { name: 'Session storage', type: 'Functional', purpose: 'Temporary PKCE code verifier during OAuth flows. Cleared when you close the tab.' },
              ].map(({ name, type, purpose }, i) => (
                <div key={name} className={`px-4 py-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{type}</span>
                  </div>
                  <p className="text-gray-600 text-xs">{purpose}</p>
                </div>
              ))}
            </div>
            <p className="text-sm">
              We do not use advertising cookies, tracking pixels, or third-party analytics cookies.
              No cookie consent banner is required because we only use strictly necessary cookies.
            </p>
          </section>

          {/* ── 7. Public Content ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Public Content</h2>
            <p className="text-sm">
              Content you set to &quot;public&quot; (OasisBio profiles, worlds) is accessible to anyone on
              the internet, including search engines. You can change visibility to &quot;private&quot; at
              any time from your dashboard. Making content private does not guarantee immediate
              removal from search engine caches.
            </p>
          </section>

          {/* ── 8. Your Rights (Global) ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Your Rights</h2>
            <p className="text-sm mb-3">Regardless of your location, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Access</strong> — request a copy of the data we hold about you</li>
              <li><strong>Correction</strong> — update inaccurate information via your profile settings</li>
              <li><strong>Deletion</strong> — delete your account and all associated data from your dashboard. Permanent and irreversible.</li>
              <li><strong>Export</strong> — download all your character data as a ZIP file from your dashboard at any time</li>
              <li><strong>Revoke OAuth access</strong> — revoke any third-party app&apos;s access from your settings</li>
              <li><strong>Object</strong> — object to processing based on legitimate interests</li>
            </ul>
            <p className="mt-3 text-sm">
              To exercise rights that cannot be completed through the platform, email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline">{CONTACT_EMAIL}</a>.
              We will respond within 30 days.
            </p>
          </section>

          {/* ── 9. Data Retention ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Data Retention</h2>
            <div className="border border-gray-100 rounded-xl overflow-hidden text-sm">
              {[
                { data: 'Account and profile data', retention: 'Until account deletion' },
                { data: 'Character content (OasisBios, worlds, DCOS, etc.)', retention: 'Until deleted by user or account deletion' },
                { data: 'Server logs (IP, request metadata)', retention: '30 days' },
                { data: 'Audit logs (publish/unpublish actions)', retention: '12 months' },
                { data: 'OAuth tokens', retention: 'Until expiry or revocation' },
                { data: 'Backup copies', retention: 'Up to 30 days after deletion' },
              ].map(({ data, retention }, i) => (
                <div key={data} className={`flex items-start gap-4 px-4 py-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <span className="text-gray-700 flex-1">{data}</span>
                  <span className="text-gray-500 text-xs flex-shrink-0 mt-0.5">{retention}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 10. Security ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Security</h2>
            <p className="text-sm">
              We implement industry-standard security measures: encrypted connections (HTTPS/TLS),
              bcrypt hashing for OAuth client secrets, JWT-signed access tokens, Row Level Security
              on all database tables, and PKCE enforcement for all OAuth flows. However, no method
              of transmission over the internet is 100% secure.
            </p>
            <p className="mt-3 text-sm">
              In the event of a data breach that affects your rights and freedoms, we will notify
              affected users and relevant supervisory authorities within 72 hours of becoming aware,
              as required by GDPR Article 33.
            </p>
          </section>

          {/* ── 11. Children ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Children&apos;s Privacy</h2>
            <p className="text-sm">
              The Service is not directed to children under 13 (or under 16 in the EU/EEA, per
              GDPR Article 8). We do not knowingly collect personal information from children
              below these ages. If you believe a child has provided us with personal information,
              contact us immediately and we will delete it.
            </p>
          </section>

          {/* ── 12. Changes ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Changes to This Policy</h2>
            <p className="text-sm">
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by updating the &quot;Last updated&quot; date. For significant changes, we will
              provide additional notice (e.g., a notice on the platform). Continued use of the
              Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* ══════════════════════════════════════════════
              REGIONAL SECTIONS
          ══════════════════════════════════════════════ */}

          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Regional Supplements</h2>
            <p className="text-sm text-gray-500">
              The following sections provide additional information for users in specific jurisdictions.
              They supplement — and do not replace — the general policy above.
            </p>
          </div>

          {/* ── GDPR ── */}
          <section id="gdpr" className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">EU / EEA</span>
              <h2 className="text-lg font-bold text-gray-900">GDPR — General Data Protection Regulation</h2>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold mb-1">Data Controller</h3>
                <p>Oasis Company (ceaserzhao) is the data controller for personal data processed through the Service. Contact: <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline">{CONTACT_EMAIL}</a></p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Additional Rights under GDPR</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Right to data portability</strong> (Art. 20) — export your data in a structured, machine-readable format via the dashboard export feature</li>
                  <li><strong>Right to restriction of processing</strong> (Art. 18) — request that we restrict processing of your data in certain circumstances</li>
                  <li><strong>Right to erasure (&quot;right to be forgotten&quot;)</strong> (Art. 17) — delete your account from the dashboard, or contact us for specific erasure requests</li>
                  <li><strong>Right not to be subject to automated decision-making</strong> (Art. 22) — we do not make automated decisions with legal or significant effects</li>
                  <li><strong>Right to lodge a complaint</strong> — you may lodge a complaint with your local supervisory authority (e.g., your national Data Protection Authority)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-1">International Data Transfers</h3>
                <p>
                  Your data may be transferred to and processed in the United States and other countries
                  outside the EEA. We rely on Standard Contractual Clauses (SCCs) approved by the
                  European Commission as the legal mechanism for these transfers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Data Processing Agreement (DPA)</h3>
                <p>
                  If you are an OAuth developer processing EU user data through &quot;Continue with Oasis&quot;,
                  a Data Processing Agreement is available at{' '}
                  <Link href="/dpa" className="text-black underline">/dpa</Link>.
                  Under GDPR, you are an independent data controller for the data you receive.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Age of Consent</h3>
                <p>In the EU/EEA, the minimum age to use the Service is 16, unless your country sets a lower age (minimum 13) under GDPR Article 8.</p>
              </div>
            </div>
          </section>

          {/* ── CCPA ── */}
          <section id="ccpa" className="bg-amber-50 border border-amber-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">California, USA</span>
              <h2 className="text-lg font-bold text-gray-900">CCPA / CPRA — California Consumer Privacy Act</h2>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold mb-1">Your California Rights</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Right to Know</strong> — request disclosure of the categories and specific pieces of personal information we have collected about you</li>
                  <li><strong>Right to Delete</strong> — request deletion of your personal information (subject to certain exceptions)</li>
                  <li><strong>Right to Correct</strong> — request correction of inaccurate personal information</li>
                  <li><strong>Right to Opt-Out of Sale or Sharing</strong> — we do not sell or share your personal information for cross-context behavioral advertising. No opt-out is required.</li>
                  <li><strong>Right to Limit Use of Sensitive Personal Information</strong> — we do not use sensitive personal information beyond what is necessary to provide the Service</li>
                  <li><strong>Right to Non-Discrimination</strong> — we will not discriminate against you for exercising your CCPA rights</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Categories of Personal Information Collected</h3>
                <p className="mb-1">In the past 12 months, we have collected:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Identifiers (email address, username, user ID)</li>
                  <li>Internet or other electronic network activity (server logs, session tokens)</li>
                  <li>User-generated content (character profiles, documents, images)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Do Not Sell or Share My Personal Information</h3>
                <p>
                  We do not sell or share your personal information. If this changes, we will update
                  this policy and provide an opt-out mechanism.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Submitting a Request</h3>
                <p>
                  To exercise your California rights, email{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline">{CONTACT_EMAIL}</a>{' '}
                  with subject line &quot;CCPA Request&quot;. We will respond within 45 days.
                  We may need to verify your identity before processing your request.
                </p>
              </div>
            </div>
          </section>

          {/* ── LGPD ── */}
          <section id="lgpd" className="bg-green-50 border border-green-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Brazil</span>
              <h2 className="text-lg font-bold text-gray-900">LGPD — Lei Geral de Proteção de Dados</h2>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold mb-1">Controller</h3>
                <p>Oasis Company (ceaserzhao) acts as the data controller (<em>controlador</em>) for personal data processed through the Service.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Legal Bases (Hipóteses Legais)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Contract performance</strong> (Art. 7, V) — providing the Service</li>
                  <li><strong>Legitimate interests</strong> (Art. 7, IX) — security, fraud prevention, audit logs</li>
                  <li><strong>Legal obligation</strong> (Art. 7, II) — compliance with applicable law</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Your Rights under LGPD (Art. 18)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Confirmation of the existence of processing</li>
                  <li>Access to your data</li>
                  <li>Correction of incomplete, inaccurate, or outdated data</li>
                  <li>Anonymization, blocking, or deletion of unnecessary data</li>
                  <li>Data portability</li>
                  <li>Deletion of data processed with your consent</li>
                  <li>Information about third parties with whom data is shared</li>
                  <li>Right to revoke consent</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-1">International Transfers</h3>
                <p>
                  Data is transferred to the USA (Supabase/Cloudflare). These transfers are made
                  under contractual safeguards consistent with LGPD Article 33.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Contact</h3>
                <p>
                  To exercise your LGPD rights, email{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline">{CONTACT_EMAIL}</a>{' '}
                  with subject line &quot;LGPD Request&quot;.
                </p>
              </div>
            </div>
          </section>

          {/* ── PIPL ── */}
          <section id="pipl" className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">China</span>
              <h2 className="text-lg font-bold text-gray-900">PIPL — Personal Information Protection Law (个人信息保护法)</h2>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold mb-1">Notice to Users in China</h3>
                <p>
                  OasisBio is operated outside of China. By using the Service, your personal
                  information will be transferred to and processed in the United States and other
                  countries. This transfer is necessary to provide the Service.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Purpose and Scope of Processing</h3>
                <p>
                  We collect and process your personal information solely for the purposes described
                  in this Privacy Policy. We do not process personal information beyond what is
                  necessary for those purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Your Rights</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Right to know and decide how your personal information is processed</li>
                  <li>Right to access and copy your personal information</li>
                  <li>Right to correct inaccurate personal information</li>
                  <li>Right to delete your personal information</li>
                  <li>Right to withdraw consent</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Contact</h3>
                <p>
                  To exercise your rights, email{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline">{CONTACT_EMAIL}</a>.
                  We will respond within 15 working days.
                </p>
              </div>
            </div>
          </section>

          {/* ── Contact ── */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p className="text-sm">
              For any privacy-related questions, requests, or complaints, contact Oasis Company at:
            </p>
            <p className="mt-2 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline font-medium">{CONTACT_EMAIL}</a>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              We aim to respond to all requests within 30 days (or within the timeframe required
              by applicable law).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
