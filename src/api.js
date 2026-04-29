import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const api = axios.create({ baseURL: API_BASE_URL });

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getUserEmail = () => localStorage.getItem('userEmail');

// Auth functions
export const login = async (email, password) => {
  return api.post('/login', { email, password });
};

export const register = async (userData) => {
  return api.post('/register', userData);
};

// Job functions
export const getAllJobs = async () => {
  return api.get('/jobs');
};

export const postJob = async (jobData) => {
  const recruiter_email = getUserEmail();
  return api.post('/jobs', { ...jobData, recruiter_email });
};

export const deleteJob = async (jobId) => {
  return api.delete(`/jobs/${jobId}`);
};

// Application functions
export const submitApplication = async (formData) => {
  return api.post('/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getMyApplications = async () => {
  const email = getUserEmail();
  return api.get('/applications/my', { params: { email } });
};

export const checkAlreadyApplied = async (jobId) => {
  const email = getUserEmail();
  return api.get('/applications/check', { params: { job_id: jobId, email } });
};

export const getAllApplications = async () => {
  return api.get('/applications');
};

export const updateApplicationStatus = async (appId, status) => {
  return api.patch(`/applications/${appId}`, { status });
};

export default {
  login,
  register,
  getAllJobs,
  postJob,
  deleteJob,
  submitApplication,
  getMyApplications,
  checkAlreadyApplied,
  getAllApplications,
  updateApplicationStatus
};