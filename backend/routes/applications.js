const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// Submit application
router.post('/applications', upload.single('resume'), async (req, res) => {
  try {
    const { job_id, name, email, phone, cover_letter } = req.body;
    const resume_path = req.file ? req.file.filename : null;

    // Get applicant ID from email
    const [users] = await req.db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'User not found. Please register first.' });
    }

    const applicant_id = users[0].id;

    // Check if already applied
    const [existing] = await req.db.execute(
      'SELECT id FROM applications WHERE job_id = ? AND applicant_id = ?',
      [job_id, applicant_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Insert application
    const [result] = await req.db.execute(
      'INSERT INTO applications (job_id, applicant_id, name, email, phone, cover_letter, resume_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [job_id, applicant_id, name, email, phone, cover_letter, resume_path]
    );

    // Update job applicant count
    await req.db.execute(
      'UPDATE jobs SET current_applicants = current_applicants + 1 WHERE id = ?',
      [job_id]
    );

    res.json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get user's applications
router.get('/applications/my', async (req, res) => {
  try {
    const { email } = req.query;

    const [applications] = await req.db.execute(`
      SELECT a.*, j.title as job_title
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.email = ?
      ORDER BY a.applied_date DESC
    `, [email]);

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Check if user already applied for a job
router.get('/applications/check', async (req, res) => {
  try {
    const { job_id, email } = req.query;

    const [applications] = await req.db.execute(
      'SELECT id FROM applications WHERE job_id = ? AND email = ?',
      [job_id, email]
    );

    res.json({ alreadyApplied: applications.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check application status' });
  }
});

// Get all applications (for recruiters)
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can view all applications' });
    }

    const [applications] = await req.db.execute(`
      SELECT a.*, j.title as job_title
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.applied_date DESC
    `);

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update application status
router.patch('/applications/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can update application status' });
    }

    const { status } = req.body;
    const appId = req.params.id;

    await req.db.execute(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, appId]
    );

    res.json({ message: 'Application status updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

module.exports = router;