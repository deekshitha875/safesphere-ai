import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';

const resources = [
  {
    icon: '🇮🇳', title: 'National Cyber Crime Portal', desc: 'Official Govt of India portal to report cyberbullying and cybercrime instantly.',
    url: 'https://cybercrime.gov.in', tag: 'India Official', color: 'border-orange-500/30 hover:border-orange-500/60',
  },
  {
    icon: '📞', title: 'iCall Helpline (TISS)', desc: 'Free psychosocial support for cyberbullying victims. Call: 9152987821',
    url: 'https://icallhelpline.org', tag: 'Free Helpline', color: 'border-green-500/30 hover:border-green-500/60',
  },
  {
    icon: '🌍', title: 'Cybersmile Foundation', desc: 'Global nonprofit dedicated to tackling cyberbullying and digital abuse worldwide.',
    url: 'https://cybersmile.org', tag: 'Global', color: 'border-blue-500/30 hover:border-blue-500/60',
  },
  {
    icon: '🛑', title: 'StopBullying.gov', desc: 'US Government\'s official resource for cyberbullying prevention and reporting.',
    url: 'https://stopbullying.gov', tag: 'USA', color: 'border-red-500/30 hover:border-red-500/60',
  },
  {
    icon: '📱', title: 'Report on Instagram', desc: 'Directly report harassment, hate speech and bullying on Instagram.',
    url: 'https://help.instagram.com/527320407282978', tag: 'Instagram', color: 'border-pink-500/30 hover:border-pink-500/60',
  },
  {
    icon: '⚖️', title: 'IT Act — Cyber Laws India', desc: 'Understand your legal rights under India\'s IT Act for online harassment.',
    url: 'https://cybercrime.gov.in/Webform/Crime_AboutCyberCrime.aspx', tag: 'Legal', color: 'border-purple-500/30 hover:border-purple-500/60',
  },
  {
    icon: '🧠', title: 'Vandrevala Foundation', desc: '24/7 mental health helpline for cyberbullying victims. Call: 1860-2662-345',
    url: 'https://www.vandrevalafoundation.com', tag: '24/7 Support', color: 'border-cyan-500/30 hover:border-cyan-500/60',
  },
  {
    icon: '👶', title: 'NCPCR — Child Protection', desc: 'National Commission for Protection of Child Rights — report child cyberbullying.',
    url: 'https://ncpcr.gov.in', tag: 'Child Safety', color: 'border-yellow-500/30 hover:border-yellow-500/60',
  },
];

export default function Resources() {
  return (
    <SectionWrapper id="resources" className="bg-dark-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-red-500/30 text-xs text-red-400 font-medium mb-4">
            🔗 Cyberbullying Resources
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Need help? <span className="gradient-text">You're not alone</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-slate-400 text-lg max-w-2xl mx-auto">
            If you or someone you know is experiencing cyberbullying, these verified resources can help you take action right now.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {resources.map((r, i) => (
            <motion.a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`glass rounded-2xl p-5 border ${r.color} transition-all group block`}>
              <div className="text-3xl mb-3">{r.icon}</div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-white font-semibold text-sm group-hover:text-brand-400 transition-colors leading-snug">{r.title}</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">{r.desc}</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
                {r.tag}
              </span>
              <div className="mt-2 text-brand-500 text-xs group-hover:text-brand-400 transition-colors">
                Visit Resource ↗
              </div>
            </motion.a>
          ))}
        </div>

        {/* Emergency banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass rounded-2xl p-6 border border-red-500/30 text-center"
          style={{ background: 'rgba(239,68,68,0.05)' }}>
          <div className="text-3xl mb-2">🚨</div>
          <h3 className="text-white font-display font-bold text-lg mb-2">Experiencing cyberbullying right now?</h3>
          <p className="text-slate-400 text-sm mb-4">Don't wait. File a complaint with our AI-powered system and our 3 certified administrators will respond within 24 hours.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/file-complaint" className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #ef4444, #e11d48)', boxShadow: '0 0 20px rgba(239,68,68,0.3)' }}>
              🚨 File a Complaint Now
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl glass border border-white/10 text-white font-semibold text-sm hover:border-red-500/50 transition-all">
              Report to Govt Portal ↗
            </a>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
