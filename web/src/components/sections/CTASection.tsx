import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

export function CTASection() {

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass rounded-3xl p-12 border border-lipilot-cyan/30 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-lipilot-cyan/10 via-transparent to-blue-500/10" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-lipilot-cyan/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-lipilot-cyan/30 mb-6"
            >
              <Sparkles className="w-5 h-5 text-lipilot-cyan" />
              <span className="text-sm font-medium text-lipilot-cyan">
                Free forever, open-source
              </span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Ready to Level Up Your <span className="text-gradient">LinkedIn Game</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Install LiPilot in 2 minutes. Free forever.
            </p>

            <div className="flex items-center justify-center">
              <a
                href="https://github.com/egorceo/lipilot"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-gradient-to-r from-lipilot-cyan to-blue-500 hover:from-blue-500 hover:to-lipilot-cyan text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-lipilot-cyan/25 hover:shadow-lipilot-cyan/40"
              >
                Get it on GitHub
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              Star us on GitHub if you find it useful!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
