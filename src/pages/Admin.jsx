import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, FileText, TrendingUp, Clock, Eye, UserCircle, Building2 } from 'lucide-react';
import { adminAPI } from '../services/api';

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalResumes: 0,
    totalMatches: 0,
  });
  const [candidates, setCandidates] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsData = await adminAPI.getDashboardStats();
        
        // Get all users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const candidatesList = users.filter(u => u.role === 'candidate' || !u.role);
        const recruitersList = users.filter(u => u.role === 'recruiter');
        
        setStats({
          ...statsData,
          totalCandidates: candidatesList.length,
          totalRecruiters: recruitersList.length,
        });
        
        setCandidates(candidatesList);
        setRecruiters(recruitersList);
        
        // Get recent activity from localStorage
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
        const activities = [];
        
        // Add recent user registrations
        users.slice(-5).reverse().forEach(user => {
          const timeAgo = getTimeAgo(new Date(user.createdAt));
          activities.push({
            id: `user_${user.id}`,
            type: 'user',
            action: `New ${user.role || 'candidate'} registered`,
            user: user.email,
            time: timeAgo,
          });
        });
        
        // Add recent jobs
        jobs.slice(-5).reverse().forEach(job => {
          const timeAgo = getTimeAgo(new Date(job.createdAt));
          activities.push({
            id: `job_${job.id}`,
            type: 'job',
            action: 'Job posted',
            user: job.title,
            time: timeAgo,
          });
        });
        
        // Add recent resumes
        resumes.slice(-5).reverse().forEach(resume => {
          const timeAgo = getTimeAgo(new Date(resume.uploadedAt));
          activities.push({
            id: `resume_${resume.id}`,
            type: 'resume',
            action: 'Resume uploaded',
            user: resume.fileName,
            time: timeAgo,
          });
        });
        
        setActivity(activities.slice(0, 10).sort((a, b) => new Date(b.time) - new Date(a.time)));
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTimeAgo = (date) => {
    if (!date || isNaN(date.getTime())) return 'Recently';
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user':
        return Users;
      case 'job':
        return Briefcase;
      case 'resume':
        return FileText;
      case 'match':
        return TrendingUp;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user':
        return 'from-blue-500 to-cyan-500';
      case 'job':
        return 'from-purple-500 to-pink-500';
      case 'resume':
        return 'from-green-500 to-emerald-500';
      case 'match':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/70">Platform overview and management</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500' },
          { label: 'Candidates', value: stats.totalCandidates, icon: UserCircle, color: 'from-purple-500 to-pink-500' },
          { label: 'Recruiters', value: stats.totalRecruiters, icon: Building2, color: 'from-indigo-500 to-blue-500' },
          { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Resumes', value: stats.totalResumes, icon: FileText, color: 'from-yellow-500 to-orange-500' },
          { label: 'Total Matches', value: stats.totalMatches, icon: TrendingUp, color: 'from-red-500 to-pink-500' },
        ].map((stat, index) => {
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
              <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
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
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        {activity.length > 0 ? (
          <div className="space-y-3">
            {activity.map((item, index) => {
            const Icon = getActivityIcon(item.type);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getActivityColor(item.type)}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.action}</p>
                  <p className="text-white/60 text-sm">{item.user}</p>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{item.time}</span>
                </div>
              </motion.div>
            );
          })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/50 text-sm">No recent activity</p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidates List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <UserCircle className="w-6 h-6" />
            Candidates ({candidates.length})
          </h2>
          {candidates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/50 text-sm">No candidates registered</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/candidate/${candidate.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{candidate.name}</p>
                      <p className="text-white/60 text-sm">{candidate.email}</p>
                    </div>
                  </div>
                  <Eye className="w-5 h-5 text-white/50 hover:text-white transition-colors" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recruiters List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Recruiters ({recruiters.length})
          </h2>
          {recruiters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/50 text-sm">No recruiters registered</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recruiters.map((recruiter, index) => (
                <motion.div
                  key={recruiter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/recruiter/${recruiter.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                      {recruiter.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{recruiter.name}</p>
                      <p className="text-white/60 text-sm">{recruiter.email}</p>
                    </div>
                  </div>
                  <Eye className="w-5 h-5 text-white/50 hover:text-white transition-colors" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

