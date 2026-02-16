import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navbar />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-lipilot-cyan to-blue-500 mb-6 shadow-lg shadow-lipilot-cyan/25">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-400">Last updated: December 23, 2024</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 border border-white/10 space-y-6 text-gray-300"
        >
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using LiPilot ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="mb-4">
              LiPilot is an AI-powered Chrome extension that helps users generate contextual comments for LinkedIn posts. The Service includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>AI-generated comment suggestions based on your persona</li>
              <li>Context-aware comment generation (text, images, threads)</li>
              <li>LinkedIn messaging assistance</li>
              <li>Persona learning and style adaptation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-semibold text-white mb-3">3.1 Registration</h3>
            <p className="mb-4">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Generate spam, harassment, or abusive content</li>
              <li>Impersonate others or provide false information</li>
              <li>Attempt to gain unauthorized access to the Service or related systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Content and Intellectual Property</h2>
            <h3 className="text-xl font-semibold text-white mb-3">5.1 Your Content</h3>
            <p className="mb-4">
              You retain ownership of any content you create using the Service. By using the Service, you grant us a license to use, store, and process your content solely for the purpose of providing and improving the Service.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">5.2 Our Content</h3>
            <p>
              The Service, including its original content, features, and functionality, is owned by LiPilot and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
            <p className="mb-4">
              The Service integrates with third-party services, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">OpenAI:</strong> For AI processing. Your use of OpenAI services is subject to OpenAI's Terms of Use.</li>
              <li><strong className="text-white">LinkedIn:</strong> The Service operates on LinkedIn's platform and is subject to LinkedIn's Terms of Service.</li>
              <li><strong className="text-white">Stripe:</strong> For payment processing, subject to Stripe's Terms of Service.</li>
            </ul>
            <p className="mt-4">
              We are not responsible for the practices of third-party services. Please review their terms and policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Subscription and Payments</h2>
            <h3 className="text-xl font-semibold text-white mb-3">7.1 Free Tier</h3>
            <p className="mb-4">
              We offer a free tier with limited features. Free tier usage is subject to fair use policies.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">7.2 Paid Subscriptions</h3>
            <p className="mb-4">
              Paid subscriptions are billed in advance on a monthly or annual basis. By subscribing, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Pay all charges associated with your account</li>
              <li>Provide accurate payment information</li>
              <li>Authorize us to charge your payment method</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">7.3 Cancellation</h3>
            <p>
              You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. No refunds are provided for partial billing periods.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimers</h2>
            <p className="mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>That the Service will be uninterrupted, secure, or error-free</li>
              <li>That the AI-generated content will be accurate, appropriate, or suitable for your use</li>
            </ul>
            <p className="mt-4">
              You are solely responsible for reviewing and approving all AI-generated content before use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LIPILOT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless LiPilot, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Non-payment of fees (for paid subscriptions)</li>
              <li>At our sole discretion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which LiPilot operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please <Link to="/support" className="text-lipilot-cyan hover:underline">contact us</Link>.
            </p>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

