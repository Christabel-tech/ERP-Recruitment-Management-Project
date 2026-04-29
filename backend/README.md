# ERP Recruitment Management Backend

This is the backend API for the ERP Recruitment Management System.

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a MySQL database
   - Run the `schema.sql` file from the project root to create tables and seed data

4. Configure environment variables:
   - Copy `.env` and update with your database credentials and JWT secret

5. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Post a new job (recruiters only)
- `DELETE /api/jobs/:id` - Delete a job (recruiters only)

### Applications
- `POST /api/applications` - Submit a job application
- `GET /api/applications/my` - Get user's applications
- `GET /api/applications/check` - Check if user applied for a job
- `GET /api/applications` - Get all applications (recruiters only)
- `PATCH /api/applications/:id` - Update application status (recruiters only)

## File Uploads

Resume files are stored in the `uploads/` directory and served at `/uploads/filename`.