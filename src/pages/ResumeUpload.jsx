import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { resumeAPI } from '../services/api';

/**
 * ResumeUpload Component
 * 
 * Handles resume file upload with drag-and-drop functionality.
 * Validates file type (PDF, DOCX) and size (max 10MB).
 * Shows upload progress and success/error states.
 */
export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Allowed file types for validation
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  /**
   * Handle drag over event to allow drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Handle file drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  /**
   * Validate and set selected file
   * Validates file type and size before setting state
   */
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setStatus('error');
      setErrorMessage('Invalid file type. Please upload a PDF or DOCX file.');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setStatus('error');
      setErrorMessage('File size exceeds 10MB limit.');
      return;
    }

    setFile(selectedFile);
    setStatus(null);
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  /**
   * Upload resume file to server
   * Uses FormData for multipart/form-data upload
   * Shows progress indicator during upload
   */
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setStatus(null);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      // Simulate progress (in production, use axios onUploadProgress callback)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await resumeAPI.uploadResume(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setStatus('success');
      setTimeout(() => {
        setFile(null);
        setStatus(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err?.response?.data?.message || err?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Upload Resume</h1>
        <p className="text-white/70">Upload candidate resumes for job matching</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-lg"
      >
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            file
              ? 'border-green-400/50 bg-green-500/10'
              : 'border-white/30 hover:border-white/50 bg-white/5'
          }`}
        >
          {!file ? (
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4"
              >
                <Upload className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Drag and drop your resume here
              </h3>
              <p className="text-white/70 mb-4">or</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
              />
              <motion.label
                htmlFor="file-upload"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all"
              >
                Browse Files
              </motion.label>
              <p className="text-white/50 text-sm mt-4">
                Supported formats: PDF, DOCX (Max 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="w-12 h-12 text-green-400" />
                <div className="text-left">
                  <p className="text-white font-semibold">{file.name}</p>
                  <p className="text-white/70 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </div>

              {uploading && (
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                </div>
              )}

              {!uploading && (
                <motion.button
                  onClick={handleUpload}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Upload Resume
                </motion.button>
              )}
            </div>
          )}
        </div>

        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-200">Resume uploaded successfully!</span>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

