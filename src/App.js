import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';

// Import all pages
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import ApplicantDashboard from './pages/applicantDashboard';
import SubmitApplication from './pages/SubmitApplication';
import RecruiterDashboard from './pages/recruiterDashboard';
import PostJob from './pages/PostJob';
import ViewApplications from './pages/ViewApplications';
import Logout from './pages/logout';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
          <Route path="/submit-application" element={<SubmitApplication />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/view-applications" element={<ViewApplications />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;