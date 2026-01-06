import axios from 'axios';

/**
 * API Service Configuration
 * 
 * This file contains all API service functions for the ATS platform.
 * All API calls are centralized here for easy maintenance and updates.
 * 
 * Base API URL - should be configured via environment variables in production
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds authentication token to all requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global error responses (e.g., 401 unauthorized)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API
 * Handles user login, registration, and logout
 * Mock implementation using localStorage for demo purposes
 */
export const authAPI = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check for admin login
    if (credentials.email === 'swathikaruppaiya63@gmail.com' && credentials.password === 'Swathi@2026') {
      // Generate mock token
      const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create/update admin user
      const adminUser = {
        id: 'admin_001',
        name: 'Swathi Karuppaiya',
        email: 'swathikaruppaiya63@gmail.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      
      // Update users list - remove if exists, add admin
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = users.filter(u => u.email !== 'swathikaruppaiya63@gmail.com');
      filteredUsers.push(adminUser);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      
      return {
        token,
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: 'admin',
        },
      };
    }
    
    // Regular user login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      const error = new Error('Invalid email or password');
      error.response = { data: { message: 'Invalid email or password' } };
      throw error;
    }
    
    // Generate mock token
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'candidate',
      },
    };
  },
  
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Prevent registration with admin email
    if (userData.email === 'swathikaruppaiya63@gmail.com') {
      const error = new Error('This email is reserved for admin');
      error.response = { data: { message: 'This email is reserved for admin use' } };
      throw error;
    }
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      const error = new Error('User already exists');
      error.response = { data: { message: 'User with this email already exists' } };
      throw error;
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email,
      password: userData.password, // In production, this would be hashed
      role: userData.role || 'candidate', // candidate, recruiter, or admin
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Generate mock token
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  },
  
  logout: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: 'Logged out successfully' };
  },
};

/**
 * Resume API
 * Handles resume upload and retrieval
 * Mock implementation using localStorage for demo purposes
 */
export const resumeAPI = {
  uploadResume: async (formData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get resumes from localStorage
    const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    
      // Create resume entry
      const file = formData.get('resume');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const newResume = {
        id: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      };
    
    resumes.push(newResume);
    localStorage.setItem('resumes', JSON.stringify(resumes));
    
    return {
      id: newResume.id,
      message: 'Resume uploaded successfully',
      resume: newResume,
    };
  },
  
  getResumes: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    return { resumes };
  },
  
  getResumeById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    const resume = resumes.find(r => r.id === id);
    if (!resume) {
      throw new Error('Resume not found');
    }
    return { resume };
  },
};

/**
 * Job API
 * Handles job posting creation and retrieval
 * Mock implementation using localStorage for demo purposes
 */
export const jobAPI = {
  uploadJob: async (jobData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get jobs from localStorage
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    
    // Create job entry
    const newJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...jobData,
      createdAt: new Date().toISOString(),
      createdBy: JSON.parse(localStorage.getItem('user') || '{}').id,
    };
    
    jobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    
    return {
      id: newJob.id,
      message: 'Job posted successfully',
      job: newJob,
    };
  },
  
  getJobs: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    return { jobs };
  },
  
  getJobById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const job = jobs.find(j => j.id === id);
    if (!job) {
      throw new Error('Job not found');
    }
    return { job };
  },
};

/**
 * Matching API
 * Handles job-resume matching operations
 * Mock implementation using localStorage for demo purposes
 */
export const matchingAPI = {
  getMatches: async (jobId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const filteredMatches = jobId ? matches.filter(m => m.jobId === jobId) : matches;
    return { matches: filteredMatches };
  },
  
  getAllMatches: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    return { matches };
  },
  
  getMatchDetails: async (matchId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const match = matches.find(m => m.id === matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    return { match };
  },
};

/**
 * Admin API
 * Handles admin dashboard data and management operations
 * Mock implementation using localStorage for demo purposes
 */
export const adminAPI = {
  getDashboardStats: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    return {
      totalUsers: users.length || 156,
      totalJobs: jobs.length || 89,
      totalResumes: resumes.length || 342,
      totalMatches: matches.length || 1247,
    };
  },
  
  getUsers: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return { users: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })) };
  },
  
  getRecentActivity: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    return { activities: activities.slice(0, 10) };
  },
};

export default api;

