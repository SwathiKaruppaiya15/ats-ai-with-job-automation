import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, TrendingUp, Users } from 'lucide-react';
import { adminAPI } from '../services/api';

export default function Dashboard() {
  const [statsData, setStatsData] = useState([
    { label: 'Total Jobs', value: '0', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Resumes', value: '0', icon: FileText, color: 'from-purple-500 to-pink-500' },
    { label: 'Match Accuracy', value: '0%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Active Users', value: '0', icon: Users, color: 'from-orange-500 to-red-500' },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminAPI.getDashboardStats();
        setStatsData([
          { label: 'Total Jobs', value: data.totalJobs.toString(), icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
          { label: 'Total Resumes', value: data.totalResumes.toString(), icon: FileText, color: 'from-purple-500 to-pink-500' },
          { label: 'Match Accuracy', value: data.totalMatches > 0 ? '94%' : '0%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
          { label: 'Active Users', value: data.totalUsers.toString(), icon: Users, color: 'from-orange-500 to-red-500' },
        ]);
        
        // Get recent activity from localStorage
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
        const activities = [];
        
        // Add recent jobs
        jobs.slice(-3).reverse().forEach(job => {
          activities.push({
            id: `job_${job.id}`,
            text: `New job posted - ${job.title}`,
            time: new Date(job.createdAt).toLocaleString(),
          });
        });
        
        // Add recent resumes
        resumes.slice(-3).reverse().forEach(resume => {
          activities.push({
            id: `resume_${resume.id}`,
            text: `New resume uploaded - ${resume.fileName}`,
            time: new Date(resume.uploadedAt).toLocaleString(),
          });
        });
        
        setRecentActivity(activities.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/70">Overview of your ATS platform</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-white/70 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-white/80 text-sm">{activity.text}</span>
                </div>
                <span className="text-white/50 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/50 text-sm">No recent activity</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

