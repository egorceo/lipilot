import { motion } from 'framer-motion';
import { Linkedin, ExternalLink } from 'lucide-react';

export function BuiltBySection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Built by <span className="text-gradient">People Who Care</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Creator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-white/10 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lipilot-cyan/20 to-blue-500/20 border border-lipilot-cyan/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-lipilot-cyan">EK</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Egor Karpovich</h3>
            <p className="text-sm text-gray-400 mb-4">Co-founder & CEO</p>
            <a
              href="https://www.linkedin.com/in/egor-karpovich/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-lipilot-cyan hover:text-lipilot-cyan/80 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              Connect on LinkedIn
            </a>
          </motion.div>

          {/* Sponsor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-white/10 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lipilot-cyan/20 to-blue-500/20 border border-lipilot-cyan/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-lipilot-cyan">TC</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Travel Code</h3>
            <p className="text-sm text-gray-400 mb-4">AI-powered corporate travel management platform</p>
            <a
              href="https://travel-code.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-lipilot-cyan hover:text-lipilot-cyan/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Travel Code
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
