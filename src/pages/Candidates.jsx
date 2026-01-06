import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Mail, FileText, Search } from 'lucide-react';
import { resumeAPI } from '../services/api';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const data = await resumeAPI.getResumes();
        // Get unique candidates from resumes
        const uniqueCandidates = [];
        const seenEmails = new Set();
        
        data.resumes?.forEach(resume => {
          if (resume.userEmail && !seenEmails.has(resume.userEmail)) {
            seenEmails.add(resume.userEmail);
            uniqueCandidates.push({
              id: resume.userId,
              name: resume.userName || 'Unknown',
              email: resume.userEmail,
              resumeCount: data.resumes.filter(r => r.userId === resume.userId).length,
            });
          }
        });
        
        setCandidates(uniqueCandidates);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Candidates</h1>
        <p className="text-white/70">Browse and manage candidate profiles</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search candidates by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <UserCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70 text-lg mb-2">No candidates found</p>
            <p className="text-white/50 text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'No candidates available'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {candidate.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{candidate.name}</h3>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{candidate.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                    <FileText className="w-5 h-5 text-white/70" />
                    <span className="text-white font-semibold">{candidate.resumeCount}</span>
                    <span className="text-white/60 text-sm">resume{candidate.resumeCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

