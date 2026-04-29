// Mock data - works without backend
const USE_MOCK = true;

// Sample job data
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Build React applications with modern UI/UX",
    min_applicants: 3,
    start_date: "2026-01-01",
    deadline: "2026-12-31",
    current_applicants: 2
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Build PHP APIs and database design",
    min_applicants: 2,
    start_date: "2026-01-01",
    deadline: "2026-12-31",
    current_applicants: 1
  },
  {
    id: 3,
    title: "Full Stack Developer",
    description: "Work on both frontend and backend",
    min_applicants: 4,
    start_date: "2026-02-01",
    deadline: "2026-11-30",
    current_applicants: 0
  }
];

// Sample applications for logged-in user
let mockMyApplications = [];

const defaultMockUsers = [
  {
    id: 1,
    name: 'John Applicant',
    email: 'applicant@test.com',
    password: 'password',
    role: 'applicant'
  },
  {
    id: 2,
    name: 'Jane Recruiter',
    email: 'recruiter@test.com',
    password: 'password',
    role: 'recruiter'
  }
];

let mockUsers = [];

const loadMockUsers = () => {
  const stored = localStorage.getItem('mockUsers');
  if (stored) {
    try {
      mockUsers = JSON.parse(stored);
      return;
    } catch (err) {
      console.warn('Failed to parse mock users from localStorage:', err);
    }
  }
  mockUsers = [...defaultMockUsers];
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
};

const saveMockUsers = () => {
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
};

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Auth functions
export const login = async (email, password) => {
  await delay();
  if (USE_MOCK) {
    loadMockUsers();

    const user = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid credentials. Please register first.');
    }

    if (user.password !== password) {
      throw new Error('Invalid email or password.');
    }

    return {
      data: {
        token: `mock-token-${user.id}`,
        role: user.role,
        name: user.name,
        email: user.email
      }
    };
  }
  // Real API call would go here
};

export const register = async (userData) => {
  await delay();
  if (USE_MOCK) {
    loadMockUsers();

    const email = userData.email.toLowerCase();
    const existing = mockUsers.find(user => user.email.toLowerCase() === email);
    if (existing) {
      throw new Error('A user with this email already exists.');
    }

    const newUser = {
      id: mockUsers.length + 1,
      name: userData.name,
      email,
      password: userData.password,
      role: userData.role || 'applicant'
    };

    mockUsers.push(newUser);
    saveMockUsers();

    return { data: { message: 'Registration successful!', userId: newUser.id } };
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
      cv: 'https://example.com/mock-cv.pdf', // Mock CV URL
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