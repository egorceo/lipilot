import { motion } from 'framer-motion';
import { Image, MessageSquare, Users, TrendingUp, Brain, Target, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Learns Your Voice',
    description: 'The AI analyzes your edits and refines its understanding of your writing style over time. After just 10 comments, it generates responses that sound authentically you.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Image,
    title: 'Multimodal Analysis',
    description: 'Analyzes images, charts, and screenshots in LinkedIn posts to provide context-aware comments that reference visual content.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageSquare,
    title: 'DM Co-pilot',
    description: 'Analyzes conversation history and suggests replies that move the conversation forward, build rapport, and close deals.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Users,
    title: 'Thread Awareness',
    description: 'Understands nested comment threads, identifies the parent comment, and generates replies that continue the specific conversation context.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Target,
    title: 'Integrated Prospecting',
    description: 'Enrichment + CRM integration in your browser. Automatically capture lead data and sync with your CRM when engaging with prospects.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Scoring & Optimization',
    description: 'Each generated comment includes engagement, expertise, and conversion scores to help you choose the highest-impact response.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Service Offer Integration',
    description: 'Subtly bridge your expertise into comments. The AI finds natural connections between post topics and your services without being pushy.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All processing happens locally or on your secure server. Your data never leaves your control, and API keys are stored server-side.',
    color: 'from-gray-500 to-slate-500',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Dominate LinkedIn</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Context-aware commenting with image analysis, thread history, and integrated prospecting — all in your browser.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-lipilot-cyan/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

