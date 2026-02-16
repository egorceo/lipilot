import { motion } from 'framer-motion';
import { Download, FolderOpen, Globe, ToggleRight, Upload, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Download,
    title: 'Download',
    description: 'Go to github.com/egorceo/lipilot → Click "Code" → "Download ZIP"',
  },
  {
    icon: FolderOpen,
    title: 'Unzip',
    description: 'Extract the downloaded archive to any folder',
  },
  {
    icon: Globe,
    title: 'Open Extensions',
    description: 'In Chrome, go to chrome://extensions',
  },
  {
    icon: ToggleRight,
    title: 'Developer Mode',
    description: 'Enable "Developer mode" toggle in the top-right corner',
  },
  {
    icon: Upload,
    title: 'Load Extension',
    description: 'Click "Load unpacked" and select the lipilot folder',
  },
  {
    icon: CheckCircle,
    title: 'Done!',
    description: 'LiPilot icon appears in your toolbar. Open any LinkedIn post and start!',
  },
];

export function InstallSection() {
  return (
    <section id="install" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How to <span className="text-gradient">Install</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get up and running in just a few steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-lipilot-cyan/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-lipilot-cyan/20 to-blue-500/20 border border-lipilot-cyan/30 flex items-center justify-center">
                  <span className="text-lipilot-cyan font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="w-5 h-5 text-lipilot-cyan" />
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          Works on Chrome, Brave, Edge, Arc, and any Chromium-based browser
        </motion.p>
      </div>
    </section>
  );
}
