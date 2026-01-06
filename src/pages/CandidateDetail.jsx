import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, UserCircle, Mail, Calendar, FileText, Briefcase } from 'lucide-react';
import { resumeAPI, matchingAPI } from '../services/api';

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get all users to find candidate
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundCandidate = users.find(u => u.id === candidateId && (u.role === 'candidate' || !u.role));
        
        if (foundCandidate) {
          setCandidate(foundCandidate);
          
          // Get resumes uploaded by this candidate
          const resumesData = await resumeAPI.getResumes();
          const candidateResumes = resumesData.resumes?.filter(r => r.userId === candidateId) || [];
          setResumes(candidateResumes);
          
          // Get matches for this candidate
          const matchesData = await matchingAPI.getAllMatches();
          const candidateMatches = matchesData.matches?.filter(m => m.candidateId === candidateId) || [];
          setMatches(candidateMatches);
        }
      } catch (err) {
        console.error('Failed to fetch candidate data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">Candidate not found</p>
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
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
            {candidate.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{candidate.name}</h1>
            <p className="text-white/70">{candidate.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              Candidate
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <FileText className="w-5 h-5" />
              <span className="text-sm">Resumes</span>
            </div>
            <p className="text-2xl font-bold text-white">{resumes.length}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <Briefcase className="w-5 h-5" />
              <span className="text-sm">Job Matches</span>
            </div>
            <p className="text-2xl font-bold text-white">{matches.length}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Member Since</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {new Date(candidate.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <UserCircle className="w-5 h-5" />
              <span className="text-sm">Status</span>
            </div>
            <p className="text-lg font-semibold text-green-400">Active</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Uploaded Resumes ({resumes.length})</h2>
          
          {resumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">No resumes uploaded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{resume.fileName}</p>
                      <p className="text-white/60 text-sm">
                        {(resume.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <span className="text-white/50 text-xs">
                      {new Date(resume.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Job Matches ({matches.length})</h2>
          
          {matches.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">No job matches yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">{match.jobTitle}</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      match.matchScore >= 85 ? 'bg-green-500/20 text-green-400' :
                      match.matchScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {match.matchScore}%
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">{match.company || 'N/A'}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

