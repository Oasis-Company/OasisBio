import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Processing Agreement — OasisBio',
  description: 'GDPR Data Processing Agreement for OAuth developers using the OasisBio platform.',
};

const LAST_UPDATED = 'April 13, 2026';
const CONTACT_EMAIL = 'oasisbiosupport@oermos.com';

export default function DpaPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link href="/developer" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Back to Developer Portal
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">Data Processing Agreement</h1>
        <p className="text-sm text-gray-400 mb-4">Last updated: {LAST_UPDATED}</p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-12 text-sm text-blue-800">
          <strong>Who needs this:</strong> This DPA is relevant if you are an OAuth developer
          using &quot;Continue with Oasis&quot; and you process personal data of users located in the
          European Union / EEA. Under GDPR, you are an independent data controller for the
          data you receive via the OAuth API.
        </div>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Parties and Scope</h2>
            <p className="text-sm">
              This Data Processing Agreement (&quot;DPA&quot;) is entered into between:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-3">
              <li><strong>Oasis Company</strong> (ceaserzhao), operator of OasisBio (&quot;OasisBio&quot; or &quot;we&quot;), acting as a <strong>data controller</strong> with respect to user data on the OasisBio platform; and</li>
              <li><strong>You</strong>, the developer or organization that has registered an OAuth application on OasisBio (&quot;Developer&quot; or &quot;you&quot;), acting as an <strong>independent data controller</strong> with respect to user data you receive via the OAuth API.</li>
            </ul>
            <p className="mt-3 text-sm">
              This DPA applies to the processing of personal data of OasisBio users who authorize
              your application via &quot;Continue with Oasis&quot;. It supplements the{' '}
              <Link href="/terms" className="text-black underline">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-black underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Nature of the Relationship</h2>
            <p className="text-sm">
              OasisBio and the Developer are <strong>independent data controllers</strong>, not
              controller-processor. This means:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-3">
              <li>OasisBio determines the purposes and means of processing user data on the OasisBio platform.</li>
              <li>The Developer independently determines the purposes and means of processing user data received via the OAuth API.</li>
              <li>Each party is separately responsible for compliance with applicable data protection laws with respect to their own processing activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Shared via OAuth API</h2>
            <p className="text-sm mb-3">
              When a user authorizes your application, OasisBio may share the following categories
              of personal data, depending on the scopes granted:
            </p>
            <div className="border border-gray-100 rounded-xl overflow-hidden text-sm">
              {[
                { scope: 'profile', data: 'Username, display name, avatar URL' },
                { scope: 'email', data: 'Email address' },
                { scope: 'oasisbios:read', data: 'Character list (title, slug, cover image, identity mode)' },
                { scope: 'oasisbios:full', data: 'Full character data (abilities, worlds, eras, references)' },
                { scope: 'dcos:read', data: 'DCOS document content' },
              ].map(({ scope, data }, i) => (
                <div key={scope} className={`flex items-start gap-4 px-4 py-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-shrink-0">{scope}</code>
                  <span className="text-gray-600">{data}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Only data corresponding to scopes explicitly authorized by the user is shared.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Developer Obligations</h2>
            <p className="text-sm mb-3">
              As an independent data controller receiving user data via the OAuth API, you agree to:
            </p>

            <h3 className="font-semibold text-gray-800 mb-2">4.1 Lawful basis</h3>
            <p className="text-sm">
              Ensure you have a valid legal basis under GDPR (or applicable law) for processing
              the personal data you receive. Typically this will be contract performance or
              legitimate interests, but you are responsible for determining the appropriate basis.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.2 Purpose limitation</h3>
            <p className="text-sm">
              Only process user data for the purposes disclosed to users at the time of authorization.
              Do not use data for purposes incompatible with those disclosed.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.3 Data minimization</h3>
            <p className="text-sm">
              Only request scopes that are strictly necessary for your application&apos;s functionality.
              Do not request broad scopes speculatively.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.4 Security</h3>
            <p className="text-sm">
              Implement appropriate technical and organizational measures to protect user data,
              including secure storage of access tokens and client secrets, encrypted transmission,
              and access controls.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.5 User rights</h3>
            <p className="text-sm">
              Respond to user requests to access, correct, or delete their data within the
              timeframes required by applicable law. When a user revokes your application&apos;s
              access on OasisBio, you must delete or anonymize their data within 30 days.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.6 Privacy notice</h3>
            <p className="text-sm">
              Provide users with a clear privacy notice explaining how you process their data,
              including data received from OasisBio.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.7 Sub-processors</h3>
            <p className="text-sm">
              If you engage sub-processors to process user data received from OasisBio, ensure
              they are bound by data protection obligations at least as protective as those in
              this DPA.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.8 Breach notification</h3>
            <p className="text-sm">
              Notify OasisBio at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline">{CONTACT_EMAIL}</a>{' '}
              within 72 hours of becoming aware of any personal data breach involving data
              received from OasisBio.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.9 International transfers</h3>
            <p className="text-sm">
              If you transfer user data outside the EEA, ensure appropriate safeguards are in
              place (e.g., Standard Contractual Clauses, adequacy decisions).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. OasisBio Obligations</h2>
            <p className="text-sm mb-3">OasisBio agrees to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Only share user data that the user has explicitly authorized via the consent screen</li>
              <li>Provide accurate scope descriptions on the consent screen so users understand what data they are sharing</li>
              <li>Maintain the security of the OAuth infrastructure (token signing, PKCE enforcement, secure storage)</li>
              <li>Notify you of material changes to the data shared via the OAuth API with reasonable advance notice</li>
              <li>Provide a mechanism for users to revoke your application&apos;s access</li>
              <li>Respond to your inquiries regarding data shared via the API within 30 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Prohibited Uses</h2>
            <p className="text-sm mb-2">You must not use data received via the OAuth API to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Build profiles of users for advertising or marketing purposes without explicit consent</li>
              <li>Sell, rent, or otherwise transfer user data to third parties</li>
              <li>Train machine learning models on user data without explicit consent</li>
              <li>Combine user data with data from other sources to re-identify anonymized individuals</li>
              <li>Discriminate against users based on protected characteristics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Audit Rights</h2>
            <p className="text-sm">
              OasisBio reserves the right to request reasonable evidence of your compliance with
              this DPA, including copies of your privacy policy and security measures. We may
              revoke your OAuth app registration if you fail to demonstrate compliance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Liability</h2>
            <p className="text-sm">
              Each party is independently liable for its own data protection compliance. OasisBio
              is not liable for your processing of user data after it has been shared with you
              via the OAuth API. You indemnify OasisBio against any claims, fines, or penalties
              arising from your non-compliance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Term and Termination</h2>
            <p className="text-sm">
              This DPA is effective from the date you register an OAuth application on OasisBio
              and remains in effect until your OAuth app registration is terminated. Upon
              termination, you must delete all user data received via the OAuth API within 30 days,
              unless retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
            <p className="text-sm">
              This DPA is governed by applicable data protection law, including GDPR where
              applicable. In the event of conflict between this DPA and the Terms of Service,
              this DPA prevails with respect to data protection matters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact</h2>
            <p className="text-sm">
              For questions about this DPA or data protection matters, contact Oasis Company at:
            </p>
            <p className="mt-2 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline font-medium">{CONTACT_EMAIL}</a>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please use subject line &quot;DPA Inquiry&quot; for faster routing.
            </p>
          </section>

          <div className="border-t border-gray-100 pt-6 text-xs text-gray-400">
            By registering and using an OAuth application on OasisBio, you acknowledge that you
            have read and agree to this Data Processing Agreement.
          </div>

        </div>
      </div>
    </div>
  );
}
