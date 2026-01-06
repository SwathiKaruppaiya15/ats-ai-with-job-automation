import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, FileText, Briefcase, X } from 'lucide-react';
import { matchingAPI } from '../services/api';

/**
 * Matches Component
 * 
 * Displays job-resume matching results in a table format.
 * Shows match scores with color-coded indicators.
 * Includes modal for viewing detailed match information.
 */

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch matches from API
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const data = await matchingAPI.getAllMatches();
        setMatches(data.matches || []);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  /**
   * Get color classes based on match score
   * Green: 85%+, Yellow: 70-84%, Red: <70%
   */
  const getMatchColor = (score) => {
    if (score >= 85) return 'text-green-400 bg-green-500/20';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  /**
   * Get border color classes based on match score
   */
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
        <h1 className="text-3xl font-bold text-white mb-2">Job Matches</h1>
        <p className="text-white/70">View candidate-resume matching results</p>
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
          <p className="text-white/70 text-lg mb-2">No matches found</p>
          <p className="text-white/50 text-sm">Upload jobs and resumes to see matching results</p>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Candidate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Job Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Match Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Skills</th>
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {match.candidateName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{match.candidateName}</p>
                          <p className="text-white/60 text-sm">{match.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-white/50" />
                        <span className="text-white/80">{match.jobTitle}</span>
                      </div>
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
                      <div className="flex flex-wrap gap-2">
                        {match.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {match.skills.length > 3 && (
                          <span className="px-2 py-1 text-white/60 text-xs">
                            +{match.skills.length - 3}
                          </span>
                        )}
                      </div>
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
                  <h3 className="text-sm font-medium text-white/70 mb-2">Candidate</h3>
                  <p className="text-white font-semibold text-lg">{selectedMatch.candidateName}</p>
                  <p className="text-white/60">{selectedMatch.email}</p>
                </div>

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

                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMatch.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-white rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

