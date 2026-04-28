// Mock data - works without backend
const USE_MOCK = true;

// Sample job data
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Build React applications with modern UI/UX",
    min_applicants: 3,
    start_date: "2025-01-01",
    deadline: "2025-12-31",
    current_applicants: 2
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Build PHP APIs and database design",
    min_applicants: 2,
    start_date: "2025-01-01",
    deadline: "2025-12-31",
    current_applicants: 1
  },
  {
    id: 3,
    title: "Full Stack Developer",
    description: "Work on both frontend and backend",
    min_applicants: 4,
    start_date: "2025-02-01",
    deadline: "2025-11-30",
    current_applicants: 0
  }
];

// Sample applications for logged-in user
let mockMyApplications = [];

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Auth functions
export const login = async (email, password) => {
  await delay();
  if (USE_MOCK) {
    if (email === "applicant@test.com") {
      return { data: { token: "mock-token-123", role: "applicant", name: "John Applicant" } };
    }
    if (email === "recruiter@test.com") {
      return { data: { token: "mock-token-456", role: "recruiter", name: "Jane Recruiter" } };
    }
    throw new Error("Invalid credentials. Use applicant@test.com or recruiter@test.com");
  }
  // Real API call would go here
};

export const register = async (userData) => {
  await delay();
  if (USE_MOCK) {
    return { data: { message: "Registration successful!", userId: 999 } };
  }
};

// Job functions
export const getAllJobs = async () => {
  await delay();
  if (USE_MOCK) {
    return { data: mockJobs };
  }
};

export const postJob = async (jobData) => {
  await delay();
  if (USE_MOCK) {
    const newJob = {
      id: mockJobs.length + 1,
      ...jobData,
      current_applicants: 0
    };
    mockJobs.push(newJob);
    return { data: { message: "Job posted!", job: newJob } };
  }
};

export const deleteJob = async (jobId) => {
  await delay();
  if (USE_MOCK) {
    const index = mockJobs.findIndex(j => j.id === parseInt(jobId));
    if (index !== -1) mockJobs.splice(index, 1);
    return { data: { message: "Job deleted!" } };
  }
};

// Application functions
export const submitApplication = async (formData) => {
  await delay();
  if (USE_MOCK) {
    const application = {
      id: mockMyApplications.length + 1,
      job_id: parseInt(formData.get('job_id')),
      job_title: mockJobs.find(j => j.id === parseInt(formData.get('job_id')))?.title,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      status: 'pending',
      applied_date: new Date().toISOString()
    };
    mockMyApplications.push(application);
    
    // Update current applicants count
    const job = mockJobs.find(j => j.id === application.job_id);
    if (job) job.current_applicants++;
    
    return { data: { message: "Application submitted!" } };
  }
};

export const getMyApplications = async () => {
  await delay();
  if (USE_MOCK) {
    return { data: mockMyApplications };
  }
};

export const checkAlreadyApplied = async (jobId) => {
  await delay();
  if (USE_MOCK) {
    const alreadyApplied = mockMyApplications.some(app => app.job_id === parseInt(jobId));
    return { data: { alreadyApplied } };
  }
};

export const getAllApplications = async () => {
  await delay();
  if (USE_MOCK) {
    return { data: mockMyApplications };
  }
};

export const updateApplicationStatus = async (appId, status) => {
  await delay();
  if (USE_MOCK) {
    const app = mockMyApplications.find(a => a.id === parseInt(appId));
    if (app) app.status = status;
    return { data: { message: "Status updated!" } };
  }
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