import { Link } from 'react-router-dom';
import { MessageSquare, Github, Linkedin, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lipilot-cyan to-blue-500 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">LiPilot</span>
            </div>
            <p className="text-sm text-gray-400">
              Free, open-source AI-powered LinkedIn comment assistant that learns your voice.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/#features" className="hover:text-lipilot-cyan transition-colors">Features</a></li>
              <li><a href="#install" className="hover:text-lipilot-cyan transition-colors">Install Guide</a></li>
              <li>
                <a href="https://github.com/egorceo/lipilot" target="_blank" rel="noopener noreferrer" className="hover:text-lipilot-cyan transition-colors flex items-center gap-1">
                  <Github className="w-3 h-3" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Creator */}
          <div>
            <h4 className="font-semibold text-white mb-4">Creator</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://www.linkedin.com/in/egor-karpovich/" target="_blank" rel="noopener noreferrer" className="hover:text-lipilot-cyan transition-colors flex items-center gap-1">
                  <Linkedin className="w-3 h-3" />
                  Egor Karpovich
                </a>
              </li>
              <li>
                <a href="https://travel-code.com" target="_blank" rel="noopener noreferrer" className="hover:text-lipilot-cyan transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Travel Code
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/privacy" className="hover:text-lipilot-cyan transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-lipilot-cyan transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-lipilot-cyan transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2025 LiPilot. Open-source under MIT License.
          </p>
          <p className="text-sm text-gray-500">
            Built by Egor Karpovich — Supported by{' '}
            <a
              href="https://travel-code.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lipilot-cyan hover:text-lipilot-cyan/80 transition-colors"
            >
              Travel Code
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
