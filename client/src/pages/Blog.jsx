import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const posts = [
  {
    tag: 'Research',
    title: 'The Rising Tide of Cyberbullying: 2025 Statistics You Need to Know',
    excerpt: 'New data reveals that 1 in 3 teenagers experience cyberbullying annually. We break down the trends and what they mean for digital safety.',
    date: 'March 28, 2025',
    readTime: '5 min read',
    emoji: '📊',
  },
  {
    tag: 'Technology',
    title: 'How NLP Models Are Revolutionizing Online Safety',
    excerpt: 'Natural Language Processing has transformed how we detect harmful content. Here\'s a deep dive into the AI behind SafeSphere.',
    date: 'March 15, 2025',
    readTime: '8 min read',
    emoji: '🤖',
  },
  {
    tag: 'Guide',
    title: 'A Parent\'s Complete Guide to Protecting Kids Online in 2025',
    excerpt: 'Practical steps, tools, and conversations to have with your children about online safety, privacy, and cyberbullying.',
    date: 'March 5, 2025',
    readTime: '10 min read',
    emoji: '👨‍👩‍👧',
  },
  {
    tag: 'Case Study',
    title: 'How Delhi Public School Reduced Cyberbullying by 78% in One Month',
    excerpt: 'A detailed look at how one school implemented SafeSphere AI and transformed their digital safety culture.',
    date: 'February 20, 2025',
    readTime: '6 min read',
    emoji: '🏫',
  },
  {
    tag: 'Policy',
    title: 'Understanding India\'s IT Act and Cyberbullying Laws',
    excerpt: 'A comprehensive overview of the legal framework around cyberbullying in India and what it means for platforms and users.',
    date: 'February 10, 2025',
    readTime: '7 min read',
    emoji: '⚖️',
  },
  {
    tag: 'Wellness',
    title: 'The Mental Health Impact of Cyberbullying and How AI Can Help',
    excerpt: 'Research shows cyberbullying has severe mental health consequences. Early detection through AI can make a critical difference.',
    date: 'January 28, 2025',
    readTime: '9 min read',
    emoji: '🧠',
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand-500/30 text-xs text-brand-400 font-medium mb-4">
            Blog
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Insights on <span className="gradient-text">Digital Safety</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Research, guides, and stories about cyberbullying prevention and AI-powered online safety.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden group cursor-pointer hover:border-brand-500/30 transition-all"
            >
              <div className="h-40 bg-gradient-to-br from-brand-500/10 to-purple-600/10 flex items-center justify-center text-6xl">
                {post.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium">
                    {post.tag}
                  </span>
                  <span className="text-slate-600 text-xs">{post.readTime}</span>
                </div>
                <h2 className="font-display font-semibold text-white text-base mb-2 group-hover:text-brand-400 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-xs">{post.date}</span>
                  <span className="text-brand-400 text-xs font-medium group-hover:translate-x-1 transition-transform inline-block">
                    Read more →
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
