import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';

export default function WhyWeBuilt() {
  return (
    <SectionWrapper className="bg-dark-800/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-red-500/30 text-xs text-red-400 font-medium mb-6">
              Our Story
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
              Why we built <span className="gradient-text">SafeSphere AI</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Cyberbullying is not a distant problem — it happens in our classrooms, hostels, and college group chats every day. We have seen friends go silent, skip classes, and lose confidence because of hateful messages they received online.
            </p>
            <p className="text-slate-400 leading-relaxed mb-4">
              Existing platforms either ignore reports or take weeks to respond. Victims feel helpless because there is no structured way to report, track, and get resolution.
            </p>
            <p className="text-slate-400 leading-relaxed">
              We built SafeSphere AI to give every victim a voice — a platform where they can report safely, track their complaint, and know that a real human admin is reviewing their case within 24 hours.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="space-y-4">
            {[
              { icon: '\ud83d\udc94', title: '1 in 3 students', desc: 'experience cyberbullying during their academic life' },
              { icon: '\ud83d\ude36', title: '59% never report', desc: 'due to fear, shame, or not knowing how to do it' },
              { icon: '\u23f0', title: 'Weeks of waiting', desc: 'is how long most platform reports take to get a response' },
              { icon: '\ud83d\udee1\ufe0f', title: 'SafeSphere changes this', desc: '24-hour admin response, real-time detection, full transparency' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 glass rounded-xl p-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
