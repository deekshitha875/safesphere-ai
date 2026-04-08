import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Student, Grade 11',
    avatar: '👩‍🎓',
    quote: "SafeSphere AI caught a bullying incident in my school group chat before it escalated. I felt genuinely protected for the first time online. It's like having a guardian angel for the internet.",
    rating: 5,
  },
  {
    name: 'Rajesh Mehta',
    role: 'Parent of two teenagers',
    avatar: '👨‍👩‍👧‍👦',
    quote: "As a parent, I was always worried about what my kids encounter online. SafeSphere gives me real-time alerts and peace of mind. The dashboard is incredibly easy to use.",
    rating: 5,
  },
  {
    name: 'Dr. Anita Verma',
    role: 'School Principal, Delhi Public School',
    avatar: '👩‍💼',
    quote: "We integrated SafeSphere AI into our school's communication platform. Incidents of cyberbullying dropped by 78% in the first month. It's transformed our digital safety culture.",
    rating: 5,
  },
  {
    name: 'Arjun Kapoor',
    role: 'HR Director, TechCorp India',
    avatar: '👨‍💻',
    quote: "Workplace harassment in digital channels was a growing concern. SafeSphere's enterprise solution gave us the tools to address it proactively. Highly recommend for any organization.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <SectionWrapper className="bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-green-500/30 text-xs text-green-400 font-medium mb-4">
            Testimonials
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by <span className="gradient-text">real people</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Thousands of users, parents, and organizations rely on SafeSphere AI every day.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500/20 to-purple-600/20 border border-brand-500/30 flex items-center justify-center text-xl">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
