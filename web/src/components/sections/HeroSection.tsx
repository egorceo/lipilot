import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check, ChevronDown } from 'lucide-react';

export function HeroSection() {

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-lipilot-cyan/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-lipilot-cyan/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-lipilot-cyan" />
            <span className="text-sm font-medium text-lipilot-cyan">
              Free & Open-Source — No Signup Required
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">AI-Powered LinkedIn</span>
            <br />
            <span className="text-gradient">Comments That Convert</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Context-aware commenting with image analysis, thread history, and
            <br />
            <span className="text-lipilot-cyan font-semibold">voice learning</span> — free forever, open-source, no account needed.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <a
              href="https://github.com/egorceo/lipilot"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-gradient-to-r from-lipilot-cyan to-blue-500 hover:from-blue-500 hover:to-lipilot-cyan text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-lipilot-cyan/25 hover:shadow-lipilot-cyan/40"
            >
              Install from GitHub
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#install"
              className="px-8 py-4 glass border border-white/20 hover:border-lipilot-cyan/50 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
            >
              <ChevronDown className="w-5 h-5 text-lipilot-cyan" />
              How to Install
            </a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Open Source (MIT License)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Supported by Travel Code</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
