import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function PrivacyPolicyPage() {
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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
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
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="mb-4">
              LiPilot ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Chrome extension and web services.
            </p>
            <p>
              By using LiPilot, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-white mb-3">2.1 Personal Information</h3>
            <p className="mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Email address (for account creation and authentication)</li>
              <li>Persona information (your professional bio and preferences)</li>
              <li>Service descriptions (if you choose to include them)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">2.2 Usage Data</h3>
            <p className="mb-4">
              We automatically collect certain information when you use our services:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Generated comments and your edits to them</li>
              <li>Usage statistics (number of generations, preferred tones)</li>
              <li>Technical data (browser type, extension version)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">2.3 LinkedIn Data</h3>
            <p className="mb-4">
              When you use the extension on LinkedIn, we process:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Post content (to generate contextual comments)</li>
              <li>Author information (names, headlines)</li>
              <li>Comment threads (to understand conversation context)</li>
              <li>Message content (if using messaging features)</li>
            </ul>
            <p className="mt-4">
              <strong className="text-white">Important:</strong> All LinkedIn data is processed locally in your browser and sent only to OpenAI API for comment generation. We do not store LinkedIn post content or messages on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Providing and improving our AI comment generation service</li>
              <li>Learning your writing style to personalize suggestions</li>
              <li>Authenticating your account and managing your subscription</li>
              <li>Sending important service updates and notifications</li>
              <li>Analyzing usage patterns to improve our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Storage and Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Data encryption in transit (HTTPS/TLS)</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>JWT-based authentication</li>
              <li>Regular security audits</li>
            </ul>
            <p>
              Your OpenAI API key (if provided) is stored encrypted in our database and is only used for your own API calls.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">OpenAI:</strong> For AI comment generation. Your data is subject to OpenAI's privacy policy.</li>
              <li><strong className="text-white">Stripe:</strong> For payment processing. Payment data is handled by Stripe and subject to their privacy policy.</li>
              <li><strong className="text-white">Email Service (SMTP):</strong> For sending authentication codes and notifications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of non-essential communications</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please <Link to="/support" className="text-lipilot-cyan hover:underline">contact us</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymize your data within 30 days, except where we are required to retain it for legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <p>
              Our service is not intended for users under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please <Link to="/support" className="text-lipilot-cyan hover:underline">contact us</Link>.
            </p>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

