import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import SectionWrapper from '../components/SectionWrapper';

const barData = [
  { day: 'Mon', safe: 42, flagged: 8 },
  { day: 'Tue', safe: 38, flagged: 12 },
  { day: 'Wed', safe: 55, flagged: 5 },
  { day: 'Thu', safe: 47, flagged: 9 },
  { day: 'Fri', safe: 60, flagged: 14 },
  { day: 'Sat', safe: 35, flagged: 6 },
  { day: 'Sun', safe: 28, flagged: 3 },
];

const lineData = [
  { time: '6am', score: 92 }, { time: '9am', score: 88 }, { time: '12pm', score: 75 },
  { time: '3pm', score: 82 }, { time: '6pm', score: 70 }, { time: '9pm', score: 85 },
];

const pieData = [
  { name: 'Safe', value: 72, color: '#10b981' },
  { name: 'Toxic', value: 15, color: '#f59e0b' },
  { name: 'Hate', value: 8, color: '#ef4444' },
  { name: 'Harassment', value: 5, color: '#8b5cf6' },
];

const flagged = [
  { text: 'You are such a loser, go away', level: 'High', color: 'text-red-400', bg: 'bg-red-500/10' },
  { text: 'Nobody wants you here', level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { text: 'Stop posting your ugly face', level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
];

export default function DashboardPreview() {
  return (
    <SectionWrapper id="dashboard" className="bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan-500/30 text-xs text-cyan-400 font-medium mb-4">
            Dashboard Preview
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Your safety <span className="gradient-text">command center</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A powerful, intuitive dashboard giving you full visibility into your digital safety landscape.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-dark rounded-2xl overflow-hidden glow-border"
        >
          {/* Dashboard header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">S</div>
              <span className="text-white font-semibold text-sm">SafeSphere Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">Live</span>
            </div>
          </div>

          <div className="p-6 grid lg:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Safety Score', value: '87%', icon: '🛡️', color: 'text-green-400' },
                { label: 'Total Scanned', value: '1,284', icon: '🔍', color: 'text-brand-400' },
                { label: 'Flagged Today', value: '23', icon: '⚠️', color: 'text-yellow-400' },
                { label: 'Alerts Sent', value: '7', icon: '🔔', color: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-4">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-slate-500 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="lg:col-span-2 glass rounded-xl p-4">
              <h4 className="text-white text-sm font-semibold mb-4">Weekly Activity</h4>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={barData} barSize={8}>
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="safe" fill="#6366f1" radius={4} />
                  <Bar dataKey="flagged" fill="#ef4444" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="glass rounded-xl p-4">
              <h4 className="text-white text-sm font-semibold mb-4">Content Breakdown</h4>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    {d.name} {d.value}%
                  </div>
                ))}
              </div>
            </div>

            {/* Flagged messages */}
            <div className="lg:col-span-2 glass rounded-xl p-4">
              <h4 className="text-white text-sm font-semibold mb-3">Recent Flagged Messages</h4>
              <div className="space-y-2">
                {flagged.map((f, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg ${f.bg}`}>
                    <span className="text-slate-300 text-xs truncate flex-1 mr-3">"{f.text}"</span>
                    <span className={`text-xs font-semibold shrink-0 ${f.color}`}>{f.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety score line */}
            <div className="glass rounded-xl p-4">
              <h4 className="text-white text-sm font-semibold mb-4">Safety Score Today</h4>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={lineData}>
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={false} />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
