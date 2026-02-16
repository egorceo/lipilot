import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function WhyOpenSourceSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 border border-white/10 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lipilot-cyan/20 to-blue-500/20 border border-lipilot-cyan/30 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-7 h-7 text-lipilot-cyan" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why <span className="text-gradient">Open Source</span>?
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            We built LiPilot as a commercial product, but decided to make it free and open-source.
            No catches, no freemium, no data harvesting. Just a useful tool for the LinkedIn community,
            backed by Travel Code.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
