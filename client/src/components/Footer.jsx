import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  const handleSub = (e) => {
    e.preventDefault();
    if (email) { setSubbed(true); setEmail(''); }
  };

  return (
    <footer className="bg-dark-800 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">S</div>
              <span className="font-display font-bold text-lg text-white">SafeSphere <span className="gradient-text">AI</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Protecting digital spaces with AI-powered cyberbullying detection and prevention.
            </p>
            <div className="flex gap-3">
              {['𝕏', 'in', 'f', '▶'].map((icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500/50 transition-all text-xs font-bold">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2">
              {['Features', 'How It Works', 'Pricing', 'Live Demo', 'API Docs'].map(l => (
                <li key={l}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Careers', 'Press', 'Contact'].map(l => (
                <li key={l}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-3">Get the latest on AI safety and cyberbullying prevention.</p>
            {subbed ? (
              <p className="text-green-400 text-sm font-medium">✓ You're subscribed!</p>
            ) : (
              <form onSubmit={handleSub} className="flex gap-2">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-dark-700 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button type="submit" className="px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">→</button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2025 SafeSphere AI. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{l}</a>
            ))}
            <a href="/admin-login" className="text-slate-600 hover:text-red-400 text-xs transition-colors">🛡️ Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
