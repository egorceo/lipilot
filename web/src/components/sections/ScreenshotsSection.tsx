import { motion } from 'framer-motion';

const screenshots = [
  { src: '/screenshots/lipilot-comments.png', caption: 'AI comment generation with context analysis and scoring' },
  { src: '/screenshots/lipilot-messages.png', caption: 'DM Co-pilot for smart LinkedIn conversation replies' },
  { src: '/screenshots/lipilot-post.png', caption: 'Post Assistant with templates and tone control' },
  { src: '/screenshots/lipilot-extension.png', caption: 'Extension popup with status and quick navigation' },
  { src: '/screenshots/lipilot-settings-1.png', caption: 'Settings — choose LLM provider, model, and persona' },
  { src: '/screenshots/lipilot-settings-2.png', caption: 'Settings — language, emojis, image analysis, learned preferences' },
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
            See how LiPilot generates context-aware comments, messages, and posts directly in LinkedIn
          </p>
        </motion.div>

        {/* Top row: 3 main feature screenshots */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {screenshots.slice(0, 3).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl border border-white/10 overflow-hidden group hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="aspect-video bg-white/5 overflow-hidden">
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover object-left-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-400 text-center">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom row: 3 secondary screenshots */}
        <div className="grid md:grid-cols-3 gap-6">
          {screenshots.slice(3).map((item, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 3) * 0.1 }}
              className="glass rounded-2xl border border-white/10 overflow-hidden group hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="aspect-video bg-white/5 overflow-hidden">
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover object-left-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
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
