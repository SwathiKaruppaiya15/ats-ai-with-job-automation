import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, TrendingUp, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobAPI, resumeAPI } from '../services/api';

export default function CandidateDashboard() {
  const [stats, setStats] = useState({
    resumesUploaded: 0,
    jobsApplied: 0,
    matches: 0,
    availableJobs: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resumesData = await resumeAPI.getResumes();
        const jobsData = await jobAPI.getJobs();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const userResumes = resumesData.resumes?.filter(r => r.userId === user.id) || [];
        const availableJobs = jobsData.jobs || [];
        
        setStats({
          resumesUploaded: userResumes.length,
          jobsApplied: 0, // Would come from applications in real app
          matches: 0, // Would come from matches in real app
          availableJobs: availableJobs.length,
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: 'Resumes Uploaded', value: stats.resumesUploaded, icon: FileText, color: 'from-blue-500 to-cyan-500', link: '/upload-resume' },
    { label: 'Available Jobs', value: stats.availableJobs, icon: Briefcase, color: 'from-purple-500 to-pink-500', link: '/browse-jobs' },
    { label: 'My Matches', value: stats.matches, icon: TrendingUp, color: 'from-green-500 to-emerald-500', link: '/my-matches' },
    { label: 'Jobs Applied', value: stats.jobsApplied, icon: Search, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Candidate Dashboard</h1>
        <p className="text-white/70">Find your dream job and track your applications</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const CardContent = (
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

          return stat.link ? (
            <Link key={stat.label} to={stat.link}>
              {CardContent}
            </Link>
          ) : (
            CardContent
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/upload-resume">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <FileText className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">Upload Resume</h3>
              <p className="text-white/60 text-sm">Add or update your resume</p>
            </motion.div>
          </Link>
          <Link to="/browse-jobs">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Search className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">Browse Jobs</h3>
              <p className="text-white/60 text-sm">Explore available positions</p>
            </motion.div>
          </Link>
          <Link to="/my-matches">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">View Matches</h3>
              <p className="text-white/60 text-sm">See your job matches</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

