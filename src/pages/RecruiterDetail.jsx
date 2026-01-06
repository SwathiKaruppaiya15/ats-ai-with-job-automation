import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Calendar, MapPin, DollarSign, FileText } from 'lucide-react';
import { jobAPI } from '../services/api';

export default function RecruiterDetail() {
  const { recruiterId } = useParams();
  const navigate = useNavigate();
  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get all users to find recruiter
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundRecruiter = users.find(u => u.id === recruiterId && u.role === 'recruiter');
        
        if (foundRecruiter) {
          setRecruiter(foundRecruiter);
          
          // Get jobs posted by this recruiter
          const jobsData = await jobAPI.getJobs();
          const recruiterJobs = jobsData.jobs?.filter(j => j.createdBy === recruiterId) || [];
          setJobs(recruiterJobs);
        }
      } catch (err) {
        console.error('Failed to fetch recruiter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recruiterId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">Recruiter not found</p>
        <button
          onClick={() => navigate('/admin')}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.button
        onClick={() => navigate('/admin')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Admin</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
            {recruiter.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{recruiter.name}</h1>
            <p className="text-white/70">{recruiter.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
              Recruiter
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <Briefcase className="w-5 h-5" />
              <span className="text-sm">Jobs Posted</span>
            </div>
            <p className="text-2xl font-bold text-white">{jobs.length}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Member Since</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {new Date(recruiter.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <FileText className="w-5 h-5" />
              <span className="text-sm">Status</span>
            </div>
            <p className="text-lg font-semibold text-green-400">Active</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Posted Jobs ({jobs.length})</h2>
        
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No jobs posted yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                      {job.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                      {job.experience && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{job.experience} years</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {job.description && (
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">{job.description}</p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-white rounded-lg text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 text-xs text-white/50">
                  Posted on: {new Date(job.createdAt).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

