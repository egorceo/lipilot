import { motion } from 'framer-motion';
import { Monitor } from 'lucide-react';

const screenshots = [
  { caption: 'AI comment generation on LinkedIn posts' },
  { caption: 'Smart refinement and persona learning' },
  { caption: 'Extension settings with multi-provider support' },
];

export function ScreenshotsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            See It in <span className="text-gradient">Action</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See how LiPilot generates context-aware comments directly in LinkedIn
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {screenshots.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="aspect-video bg-white/5 flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Screenshot coming soon</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-400 text-center">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
