import { motion } from 'framer-motion';
import { User, Bell } from 'lucide-react';

export default function Navbar({ user }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4 flex items-center justify-between"
    >
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-white">Welcome back, {user?.name || 'User'}</h2>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Bell className="w-5 h-5 text-white" />
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{user?.name || 'User'}</span>
            <span className="text-xs text-white/70 capitalize">{user?.role || 'user'}</span>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

