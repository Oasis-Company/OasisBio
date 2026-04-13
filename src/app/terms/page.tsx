import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — OasisBio',
  description: 'The terms and conditions governing your use of OasisBio.',
};

const LAST_UPDATED = 'April 13, 2026';
const CONTACT_EMAIL = 'oasisbiosupport@oermos.com';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Back to OasisBio
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of OasisBio, operated
              by Oasis Company (ceaserzhao) (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By creating an account or
              using the Service, you agree to be bound by these Terms.
            </p>
            <p className="mt-3">
              If you do not agree to these Terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. The Service</h2>
            <p className="text-sm">
              OasisBio is a digital identity builder and character creator platform that allows users
              to create, manage, and publish fictional character profiles, worldbuilding content, DCOS
              documents, ability pools, and related creative content. We also provide an OAuth 2.0
              provider (&quot;Continue with Oasis&quot;) that allows third-party applications to authenticate
              users with their OasisBio identity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Accounts</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>You must be at least 13 years old to create an account.</li>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>You must provide a valid email address. We use passwordless OTP authentication.</li>
              <li>You may not create accounts for others without their consent.</li>
              <li>You may not use the Service for any illegal purpose or in violation of any laws.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Your Content</h2>

            <h3 className="font-semibold text-gray-800 mb-2">4.1 Ownership</h3>
            <p className="text-sm">
              You retain full ownership of all content you create on OasisBio, including character
              profiles, DCOS documents, world settings, and any other creative work you upload or
              generate (&quot;Your Content&quot;).
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.2 License to us</h3>
            <p className="text-sm">
              By posting content on OasisBio, you grant Oasis Company a non-exclusive, worldwide,
              royalty-free license to store, display, and transmit Your Content solely for the purpose
              of operating and providing the Service. This license ends when you delete the content
              or your account.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.3 Content standards</h3>
            <p className="text-sm mb-2">You agree not to post content that:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Infringes any third party&apos;s intellectual property rights</li>
              <li>Contains illegal material, including child sexual abuse material (CSAM)</li>
              <li>Constitutes harassment, hate speech, or threats against individuals or groups</li>
              <li>Contains malware, viruses, or malicious code</li>
              <li>Impersonates real individuals without their consent</li>
              <li>Violates any applicable law or regulation</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.4 Public content</h3>
            <p className="text-sm">
              Content you set to &quot;public&quot; is visible to anyone. You are solely responsible for
              ensuring your public content complies with applicable laws and does not infringe
              third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. OAuth Developer Terms</h2>
            <p className="text-sm mb-3">
              If you register an OAuth application to use the &quot;Continue with Oasis&quot; feature, you
              additionally agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Only request scopes that your application genuinely needs</li>
              <li>Not store or use user data beyond what is necessary for your application&apos;s stated purpose</li>
              <li>Maintain the security of your client secret and never expose it in client-side code</li>
              <li>Provide accurate information about your application, including a valid homepage URL and redirect URIs</li>
              <li>Not use the OAuth integration to scrape, harvest, or aggregate user data at scale</li>
              <li>Comply with all applicable privacy laws regarding the user data you receive</li>
              <li>Promptly revoke tokens and delete user data when users disconnect your application</li>
            </ul>
            <p className="mt-3 text-sm">
              We reserve the right to revoke OAuth app registrations that violate these terms or
              that we determine are harmful to our users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p className="text-sm">
              The OasisBio platform, including its design, code, trademarks, and branding, is owned
              by Oasis Company and is licensed under the MIT License where applicable (see{' '}
              <a href="https://github.com/Oasis-Company" target="_blank" rel="noopener noreferrer" className="text-black underline">
                GitHub
              </a>
              ). The MIT License applies to the source code only and does not grant rights to the
              OasisBio name, logo, or brand assets.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Prohibited Uses</h2>
            <p className="text-sm mb-2">You may not use the Service to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure</li>
              <li>Conduct automated scraping, crawling, or data harvesting without prior written consent</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Circumvent any rate limits, access controls, or security measures</li>
              <li>Use the Service to send spam or unsolicited communications</li>
              <li>Reverse engineer or attempt to extract the source code of proprietary components</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Data Export and Portability</h2>
            <p className="text-sm">
              You may export all your character data at any time using the export feature in your
              dashboard. We support ZIP-based export of all your content. We encourage you to
              maintain your own backups.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Account Termination</h2>
            <p className="text-sm">
              You may delete your account at any time from your dashboard settings. Account deletion
              is permanent and irreversible — all your content will be permanently removed.
            </p>
            <p className="mt-3 text-sm">
              We may suspend or terminate your account if you violate these Terms, with or without
              notice. In cases of serious violations (e.g., CSAM, illegal activity), we will terminate
              immediately and may report to relevant authorities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Disclaimers</h2>
            <p className="text-sm">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="mt-3 text-sm">
              We do not warrant that the Service will be uninterrupted, error-free, or free of
              viruses or other harmful components. We do not warrant that any content on the Service
              is accurate, complete, or reliable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Limitation of Liability</h2>
            <p className="text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OASIS COMPANY SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
              LOSS OF DATA, LOSS OF PROFITS, OR LOSS OF GOODWILL, ARISING OUT OF OR IN CONNECTION
              WITH YOUR USE OF THE SERVICE.
            </p>
            <p className="mt-3 text-sm">
              OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM THESE TERMS OR THE SERVICE
              SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM
              (OR $10 USD IF YOU HAVE NOT PAID US ANYTHING).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Indemnification</h2>
            <p className="text-sm">
              You agree to indemnify and hold harmless Oasis Company and its operators from any
              claims, damages, losses, or expenses (including reasonable legal fees) arising from
              your use of the Service, Your Content, or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Governing Law</h2>
            <p className="text-sm">
              These Terms are governed by and construed in accordance with applicable international
              law. The following jurisdiction-specific provisions apply:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm mt-3">
              <li>
                <strong>European Union / EEA users:</strong> Nothing in these Terms limits your
                rights under applicable EU consumer protection laws, including the EU Consumer
                Rights Directive and GDPR. Disputes may be submitted to your local courts or
                the EU Online Dispute Resolution platform at{' '}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-black underline">ec.europa.eu/consumers/odr</a>.
              </li>
              <li>
                <strong>California (USA) users:</strong> Nothing in these Terms waives your
                rights under the California Consumer Privacy Act (CCPA/CPRA) or other
                California consumer protection laws.
              </li>
              <li>
                <strong>Brazil users:</strong> Nothing in these Terms limits your rights under
                the Lei Geral de Proteção de Dados (LGPD) or the Brazilian Consumer Defense Code (CDC).
              </li>
              <li>
                <strong>All other users:</strong> These Terms are governed by general principles
                of international commercial law. We will make reasonable efforts to resolve
                disputes amicably.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">14. Changes to Terms</h2>
            <p className="text-sm">
              We may update these Terms from time to time. We will notify you of material changes
              by updating the &quot;Last updated&quot; date. Continued use of the Service after changes
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">15. Contact</h2>
            <p className="text-sm">
              For questions about these Terms, contact Oasis Company at:
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
