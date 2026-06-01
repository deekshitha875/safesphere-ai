import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md">
        <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8">The page you are looking for does not exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold text-sm btn-glow">
            Go Home
          </Link>
          <Link to="/dashboard" className="px-6 py-3 rounded-xl glass border border-white/10 text-white font-semibold text-sm hover:border-brand-500/50 transition-all">
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
