import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';

const cases = [
  { icon: '🎓', title: 'Students & Schools', desc: 'Protect students from online bullying on school platforms, forums, and social media. Empower educators with real-time insights.', tags: ['School portals', 'Student safety'] },
  { icon: '👨‍👩‍👧', title: 'Parents & Families', desc: 'Give parents peace of mind with monitoring tools that alert them when their children encounter harmful content online.', tags: ['Parental controls', 'Family safety'] },
  { icon: '📱', title: 'Social Media Platforms', desc: 'Integrate SafeSphere AI into your platform to automatically moderate content and maintain a healthy community.', tags: ['API integration', 'Auto-moderation'] },
  { icon: '🏢', title: 'Corporate Environments', desc: 'Prevent workplace harassment in internal communication tools, Slack, Teams, and email platforms.', tags: ['HR compliance', 'Workplace safety'] },
];

export default function UseCases() {
  return (
    <SectionWrapper id="use-cases">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-amber-500/30 text-xs text-amber-400 font-medium mb-4">
            Use Cases
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built for <span className="gradient-text">every community</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From classrooms to boardrooms, SafeSphere AI adapts to protect every digital environment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 group cursor-default"
            >
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="font-display font-semibold text-white text-xl mb-2">{c.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{c.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {c.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
