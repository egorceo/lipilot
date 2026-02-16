import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Sparkles } from 'lucide-react';

const evolutionStages = [
  {
    time: 'Day 1',
    persona: 'You are a professional LinkedIn user.',
    comment: 'Great insights! This is really valuable information.',
    traits: { formality: 0.5, length: 0.5, emoji: 0.1 },
  },
  {
    time: 'Week 1',
    persona: 'You are a data-driven professional who prefers concise, actionable insights. You value evidence over opinions.',
    comment: 'The data here is compelling. Have you considered how this scales across different market segments?',
    traits: { formality: 0.6, length: 0.7, emoji: 0.0 },
  },
  {
    time: 'Month 1',
    persona: 'You are a strategic thinker who connects dots across industries. Your comments are concise but substantive, often asking probing questions that reveal deeper insights. You prefer data-backed arguments and avoid generic praise.',
    comment: 'Interesting angle. The scalability question is key — we\'ve seen similar patterns in B2B SaaS. How does this compare to your unit economics?',
    traits: { formality: 0.7, length: 0.8, emoji: 0.0 },
  },
];

export function PersonaEvolutionSection() {
  const [selectedStage, setSelectedStage] = useState(1);

  const stage = evolutionStages[selectedStage];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-lipilot-cyan/30 mb-6">
            <Brain className="w-5 h-5 text-lipilot-cyan" />
            <span className="text-sm font-medium text-lipilot-cyan">AI Learning Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Watch Your <span className="text-gradient">Persona Evolve</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The AI learns from every edit you make, refining its understanding of your unique voice and writing style.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Timeline Slider */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {evolutionStages.map((stage, index) => (
              <button
                key={index}
                onClick={() => setSelectedStage(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedStage === index
                    ? 'glass border-lipilot-cyan/50 bg-lipilot-cyan/10'
                    : 'glass border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{stage.time}</span>
                  {selectedStage === index && (
                    <Sparkles className="w-5 h-5 text-lipilot-cyan" />
                  )}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{stage.persona}</p>
              </button>
            ))}
          </motion.div>

          {/* Evolution Preview */}
          <motion.div
            key={selectedStage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-lipilot-cyan" />
                <span className="text-sm font-semibold text-lipilot-cyan">
                  Refined Persona
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">{stage.persona}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-blue-400">
                  Generated Comment
                </span>
              </div>
              <div className="glass rounded-lg p-4 border border-white/10">
                <p className="text-gray-200 leading-relaxed">{stage.comment}</p>
              </div>
            </div>

            {/* Traits Visualization */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Formality</span>
                  <span className="text-xs font-semibold text-white">
                    {Math.round(stage.traits.formality * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.traits.formality * 100}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Length Preference</span>
                  <span className="text-xs font-semibold text-white">
                    {Math.round(stage.traits.length * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.traits.length * 100}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Emoji Usage</span>
                  <span className="text-xs font-semibold text-white">
                    {Math.round(stage.traits.emoji * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.traits.emoji * 100}%` }}
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

