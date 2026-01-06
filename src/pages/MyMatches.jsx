import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, FileText, Briefcase, X, TrendingUp } from 'lucide-react';
import { matchingAPI } from '../services/api';

export default function MyMatches() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const data = await matchingAPI.getAllMatches();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        // Filter matches for current candidate
        const userMatches = data.matches?.filter(m => m.candidateId === user.id) || [];
        setMatches(userMatches);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const getMatchColor = (score) => {
    if (score >= 85) return 'text-green-400 bg-green-500/20';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getMatchBorder = (score) => {
    if (score >= 85) return 'border-green-500/50';
    if (score >= 70) return 'border-yellow-500/50';
    return 'border-red-500/50';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">My Matches</h1>
        <p className="text-white/70">View your job matches and application status</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-12 text-center"
        >
          <TrendingUp className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/70 text-lg mb-2">No matches yet</p>
          <p className="text-white/50 text-sm">Upload your resume to start getting matched with jobs</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Job Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Match Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white/90">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {matches.map((match, index) => (
                  <motion.tr
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-white/50" />
                        <span className="text-white font-medium">{match.jobTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80">{match.company || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(
                          match.matchScore
                        )} border ${getMatchBorder(match.matchScore)}`}
                      >
                        {match.matchScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                        Matched
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <motion.button
                        onClick={() => setSelectedMatch(match)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5 text-white/70 hover:text-white" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Match Details</h2>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Job Title</h3>
                  <p className="text-white">{selectedMatch.jobTitle}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Match Score</h3>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold ${getMatchColor(
                      selectedMatch.matchScore
                    )} border ${getMatchBorder(selectedMatch.matchScore)}`}
                  >
                    {selectedMatch.matchScore}%
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

