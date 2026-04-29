-- schema.sql
-- Recruitment Management Project database schema.
-- Replace mock in-memory data with a proper relational database.

CREATE DATABASE IF NOT EXISTS recruitment_management;
USE recruitment_management;

-- Users can be applicants or recruiters.
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('applicant', 'recruiter') NOT NULL DEFAULT 'applicant',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Jobs posted by recruiters.
CREATE TABLE IF NOT EXISTS jobs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  recruiter_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  min_applicants INT NOT NULL DEFAULT 1,
  current_applicants INT NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  deadline DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_jobs_recruiter_id (recruiter_id),
  CONSTRAINT fk_jobs_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Applications submitted by applicants for jobs.
CREATE TABLE IF NOT EXISTS applications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  job_id INT UNSIGNED NOT NULL,
  applicant_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  cover_letter TEXT,
  resume_path VARCHAR(512),
  status ENUM('pending', 'shortlisted', 'rejected') NOT NULL DEFAULT 'pending',
  applied_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_applications_job_id (job_id),
  KEY idx_applications_applicant_id (applicant_id),
  KEY idx_applications_status (status),
  CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_applications_applicant FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed data matching the mock account credentials used by the front-end.
INSERT IGNORE INTO users (id, name, email, password, role) VALUES
  (1, 'John Applicant', 'applicant@test.com', 'password', 'applicant'),
  (2, 'Jane Recruiter', 'recruiter@test.com', 'password', 'recruiter');

-- Sample jobs from the mock database.
INSERT IGNORE INTO jobs (id, recruiter_id, title, description, min_applicants, current_applicants, start_date, deadline) VALUES
  (1, 2, 'Frontend Developer', 'Build React applications with modern UI/UX', 3, 2, '2025-01-01', '2025-12-31'),
  (2, 2, 'Backend Developer', 'Build PHP APIs and database design', 2, 1, '2025-01-01', '2025-12-31'),
  (3, 2, 'Full Stack Developer', 'Work on both frontend and backend', 4, 0, '2025-02-01', '2025-11-30');

-- Example application row (optional).
-- Uncomment and adjust applicant_id/job_id when you want initial application data.
-- INSERT IGNORE INTO applications (job_id, applicant_id, name, email, phone, cover_letter, resume_path, status) VALUES
--   (1, 1, 'John Applicant', 'applicant@test.com', '+1234567890', 'I am a great fit for this role.', '/resumes/john_applicant_resume.pdf', 'pending');

-- NOTE: In a real backend, job_title is derived by joining applications.job_id to jobs.title.
-- The front-end can continue to receive job_title from a query result, but it does not need to be stored redundantly.
