import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ResumeUpload from './pages/ResumeUpload';
import JobUpload from './pages/JobUpload';
import Matches from './pages/Matches';
import BrowseJobs from './pages/BrowseJobs';
import MyMatches from './pages/MyMatches';
import Candidates from './pages/Candidates';
import Admin from './pages/Admin';
import RecruiterDetail from './pages/RecruiterDetail';
import CandidateDetail from './pages/CandidateDetail';

// Protected Route component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

// Public Route component (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return children;
  
  // Redirect based on user role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'candidate';
  return <Navigate to={`/${role === 'admin' ? 'dashboard' : role === 'recruiter' ? 'recruiter-dashboard' : 'candidate-dashboard'}`} replace />;
}

// Role-based route component
function RoleBasedRoute({ allowedRoles, children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'candidate';
  
  if (allowedRoles.includes(userRole)) {
    return children;
  }
  
  // Redirect based on role
  if (userRole === 'admin') {
    return <Navigate to="/dashboard" replace />;
  } else if (userRole === 'recruiter') {
    return <Navigate to="/recruiter-dashboard" replace />;
  } else {
    return <Navigate to="/candidate-dashboard" replace />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/candidate-dashboard" replace />} />
            
            {/* Admin Routes */}
            <Route path="dashboard" element={<RoleBasedRoute allowedRoles={['admin']}><Dashboard /></RoleBasedRoute>} />
            <Route path="admin" element={<RoleBasedRoute allowedRoles={['admin']}><Admin /></RoleBasedRoute>} />
            <Route path="admin/recruiter/:recruiterId" element={<RoleBasedRoute allowedRoles={['admin']}><RecruiterDetail /></RoleBasedRoute>} />
            <Route path="admin/candidate/:candidateId" element={<RoleBasedRoute allowedRoles={['admin']}><CandidateDetail /></RoleBasedRoute>} />
            
            {/* Candidate Routes */}
            <Route path="candidate-dashboard" element={<RoleBasedRoute allowedRoles={['candidate', 'admin']}><CandidateDashboard /></RoleBasedRoute>} />
            <Route path="browse-jobs" element={<RoleBasedRoute allowedRoles={['candidate', 'admin']}><BrowseJobs /></RoleBasedRoute>} />
            <Route path="my-matches" element={<RoleBasedRoute allowedRoles={['candidate', 'admin']}><MyMatches /></RoleBasedRoute>} />
            
            {/* Recruiter Routes */}
            <Route path="recruiter-dashboard" element={<RoleBasedRoute allowedRoles={['recruiter', 'admin']}><RecruiterDashboard /></RoleBasedRoute>} />
            <Route path="upload-job" element={<RoleBasedRoute allowedRoles={['recruiter', 'admin']}><JobUpload /></RoleBasedRoute>} />
            <Route path="matches" element={<RoleBasedRoute allowedRoles={['recruiter', 'admin']}><Matches /></RoleBasedRoute>} />
            <Route path="candidates" element={<RoleBasedRoute allowedRoles={['recruiter', 'admin']}><Candidates /></RoleBasedRoute>} />
            
            {/* Shared Routes */}
            <Route path="upload-resume" element={<ResumeUpload />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
