import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Search,
  UserCircle,
} from 'lucide-react';

// Get menu items based on user role
const getMenuItems = (role) => {
  const commonItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  if (role === 'candidate') {
    return [
      ...commonItems,
      { path: '/upload-resume', label: 'Upload Resume', icon: FileText },
      { path: '/browse-jobs', label: 'Browse Jobs', icon: Search },
      { path: '/my-matches', label: 'My Matches', icon: Users },
    ];
  } else if (role === 'recruiter') {
    return [
      ...commonItems,
      { path: '/upload-job', label: 'Post Job', icon: Briefcase },
      { path: '/matches', label: 'View Matches', icon: Users },
      { path: '/candidates', label: 'Candidates', icon: UserCircle },
    ];
  } else if (role === 'admin') {
    return [
      ...commonItems,
      { path: '/upload-resume', label: 'Upload Resume', icon: FileText },
      { path: '/upload-job', label: 'Upload Job', icon: Briefcase },
      { path: '/matches', label: 'Matches', icon: Users },
      { path: '/admin', label: 'Admin Panel', icon: Settings },
    ];
  }

  return commonItems;
};

export default function Sidebar({ onLogout, userRole = 'candidate' }) {
  const menuItems = getMenuItems(userRole);
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 min-h-screen p-6 flex flex-col"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">ATS AI</h1>
        <p className="text-white/70 text-sm">Job Automation Platform</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      <motion.button
        onClick={onLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 mt-auto"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </motion.button>
    </motion.aside>
  );
}

