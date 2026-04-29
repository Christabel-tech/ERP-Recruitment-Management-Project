const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });

  try {
    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS recruitment_management');
    await connection.query('USE recruitment_management');
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('applicant', 'recruiter') NOT NULL DEFAULT 'applicant',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create jobs table
    await connection.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create applications table
    await connection.query(`
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
        CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        CONSTRAINT fk_applications_applicant FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    console.log('✅ Tables created successfully!');
    
    // Hash and insert seed data
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Insert test users with HASHED passwords
    await connection.query(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['John Applicant', 'applicant@test.com', hashedPassword, 'applicant']
    );
    
    await connection.query(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Jane Recruiter', 'recruiter@test.com', hashedPassword, 'recruiter']
    );
    
    // Get recruiter ID for sample jobs
    const [recruiters] = await connection.query('SELECT id FROM users WHERE email = ?', ['recruiter@test.com']);
    const recruiterId = recruiters[0].id;
    
    // Insert sample jobs
    await connection.query(
      'INSERT IGNORE INTO jobs (recruiter_id, title, description, min_applicants, start_date, deadline) VALUES (?, ?, ?, ?, ?, ?)',
      [recruiterId, 'Senior Developer', 'We are looking for an experienced developer...', 5, '2026-05-01', '2026-06-01']
    );
    
    await connection.query(
      'INSERT IGNORE INTO jobs (recruiter_id, title, description, min_applicants, start_date, deadline) VALUES (?, ?, ?, ?, ?, ?)',
      [recruiterId, 'UI/UX Designer', 'Design engaging user interfaces...', 3, '2026-05-15', '2026-06-15']
    );
    
    console.log('✅ Seed data inserted successfully!');
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('Test Credentials:');
    console.log('  Applicant: applicant@test.com / password');
    console.log('  Recruiter: recruiter@test.com / password');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setupDatabase();
