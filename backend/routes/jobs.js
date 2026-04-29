const express = require('express');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Get all jobs
router.get('/jobs', async (req, res) => {
  try {
    const [jobs] = await req.db.execute(`
      SELECT j.*, u.name as recruiter_name
      FROM jobs j
      JOIN users u ON j.recruiter_id = u.id
      ORDER BY j.created_at DESC
    `);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Post a new job
router.post('/jobs', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can post jobs' });
    }

    const { title, description, min_applicants, start_date, deadline, recruiter_email } = req.body;

    // Get recruiter ID from email
    const [users] = await req.db.execute('SELECT id FROM users WHERE email = ?', [recruiter_email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Recruiter not found' });
    }

    const recruiter_id = users[0].id;

    const [result] = await req.db.execute(
      'INSERT INTO jobs (recruiter_id, title, description, min_applicants, start_date, deadline) VALUES (?, ?, ?, ?, ?, ?)',
      [recruiter_id, title, description, min_applicants, start_date, deadline]
    );

    // Get the inserted job
    const [job] = await req.db.execute('SELECT * FROM jobs WHERE id = ?', [result.insertId]);

    res.json({ message: 'Job posted successfully!', job: job[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to post job' });
  }
});

// Delete a job
router.delete('/jobs/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can delete jobs' });
    }

    const jobId = req.params.id;

    // Check if job belongs to user
    const [jobs] = await req.db.execute('SELECT recruiter_id FROM jobs WHERE id = ?', [jobId]);
    if (jobs.length === 0 || jobs[0].recruiter_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await req.db.execute('DELETE FROM jobs WHERE id = ?', [jobId]);
    res.json({ message: 'Job deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

module.exports = router;