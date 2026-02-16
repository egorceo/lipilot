import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function CookiePolicyPage() {
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
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
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
            <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p>
              This Cookie Policy explains how LiPilot ("we," "our," or "us") uses cookies and similar technologies when you use our website and Chrome extension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Authentication:</strong> To keep you logged in and maintain your session</li>
              <li><strong className="text-white">Preferences:</strong> To remember your settings and preferences</li>
              <li><strong className="text-white">Analytics:</strong> To understand how you use our service and improve it</li>
              <li><strong className="text-white">Security:</strong> To protect against fraud and ensure service security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">3.1 Essential Cookies</h3>
            <p className="mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
              <li><strong className="text-white">Session cookies:</strong> Maintain your login state</li>
              <li><strong className="text-white">Security cookies:</strong> Protect against CSRF attacks</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">3.2 Functional Cookies</h3>
            <p className="mb-4">
              These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
              <li><strong className="text-white">Preference cookies:</strong> Remember your settings (theme, language, etc.)</li>
              <li><strong className="text-white">Authentication tokens:</strong> Store your login credentials securely</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">3.3 Analytics Cookies</h3>
            <p className="mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Page views and navigation patterns</li>
              <li>Feature usage statistics</li>
              <li>Error tracking and performance monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Cookies</h2>
            <p className="mb-4">
              Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Stripe:</strong> Payment processing cookies (when making donations)</li>
              <li><strong className="text-white">Analytics Services:</strong> To understand usage patterns (if applicable)</li>
            </ul>
            <p className="mt-4">
              These third parties may use cookies to collect information about your online activities across different websites. We do not control these cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Chrome Extension Storage</h2>
            <p className="mb-4">
              Our Chrome extension uses Chrome's storage API (similar to cookies) to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Store your authentication token</li>
              <li>Save your persona and preferences</li>
              <li>Cache settings and configuration</li>
              <li>Maintain extension state</li>
            </ul>
            <p className="mt-4">
              This data is stored locally in your browser and is not shared with third parties except as necessary to provide the Service (e.g., sending requests to our API server).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Managing Cookies</h2>
            <h3 className="text-xl font-semibold text-white mb-3">6.1 Browser Settings</h3>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
              <li>Block all cookies</li>
              <li>Block third-party cookies</li>
              <li>Delete cookies when you close your browser</li>
              <li>Delete existing cookies</li>
            </ul>
            <p className="mb-4">
              <strong className="text-white">Note:</strong> Blocking or deleting cookies may affect your ability to use certain features of our Service.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">6.2 Extension Settings</h3>
            <p>
              You can clear extension storage data by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Uninstalling and reinstalling the extension</li>
              <li>Using Chrome's extension management page to clear storage</li>
              <li>Using the extension's settings to reset preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Do Not Track Signals</h2>
            <p>
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals should be interpreted. We do not currently respond to DNT browser signals or mechanisms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please <Link to="/support" className="text-lipilot-cyan hover:underline">contact us</Link>.
            </p>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

