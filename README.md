# Job Portal Backend API

Backend API for a job portal application built with Node.js, Express, MongoDB, Mongoose, JWT, and Multer.

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create `.env`

Create `backend/.env`:

```env
MONGO_URL=your_mongodb_connection_string
PORT=5000
SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

### 3. Run backend

```bash
npm run dev
```

Server runs on:

```text
http://localhost:5000
```

## Environment Variables

| Variable | Description |
|--------|-------------|
| `MONGO_URL` | MongoDB connection string |
| `PORT` | Backend server port |
| `SECRET_KEY` | JWT secret key |
| `FRONTEND_URL` | Allowed frontend origin for CORS |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests allowed per IP in one window |

## Authentication

- JWT is stored in an HTTP-only cookie named `token`
- Protected routes require that cookie
- Frontend requests should send credentials
- This backend uses token-based authentication with cookies, not Bearer headers

## Thoughtful Additions Implemented

- Token-based authentication with JWT cookie flow
- Search support for public job listing
- Pagination support for jobs, recruiter jobs, applications, and applicants
- Soft delete support for recruiter job deletion
- Global in-memory rate limiting middleware
- Lightweight API docs endpoint at `/api/v1/docs`
- Small unit-style test coverage for helper utilities

## File Upload

- Resume field name: `resume`
- Allowed types: `pdf`, `doc`, `docx`
- Max size: `5 MB`
- Upload path: `backend/uploads/resume`

## Base URL

```text
http://localhost:5000/api/v1
```

## API Endpoints

### Health

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Server and database health check | Public |

### User Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/user/register` | Register user or recruiter | Public |
| POST | `/user/login` | Login and get auth cookie | Public |
| POST | `/user/logout` | Logout user | Authenticated |
| GET | `/user/me` | Get current logged-in user | Authenticated |
| POST | `/user/profile/update` | Update profile details | Authenticated |
| PUT | `/user/update-resume` | Update resume file | User only |

### Company

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/company/register` | Create company | Authenticated |
| GET | `/company/get` | Get companies | Public / Authenticated |
| GET | `/company/get/:id` | Get single company | Public |
| PUT | `/company/update/:id` | Update company | Authenticated |

### Jobs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/job/post` | Create job | Recruiter |
| POST | `/job` | Create job | Recruiter |
| GET | `/job` | List all jobs | Public |
| GET | `/job/get` | List all jobs | Public |
| GET | `/job/get/:id` | Get single job | Public |
| GET | `/job/getadminjobs` | Get recruiter-created jobs | Recruiter |
| DELETE | `/job/delete/:id` | Soft delete recruiter job | Recruiter |
| DELETE | `/job/:id` | Soft delete recruiter job | Recruiter |

Also available with the same behavior under:

- `/api/v1/jobs`

### Applications

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/application/apply/:jobId` | Apply for a job | User only |
| GET | `/application/get` | Get logged-in user's applications | User only |
| GET | `/application/my` | Get logged-in user's applications | User only |
| GET | `/application/:id/applicant` | Get applicants for a job | Recruiter |
| GET | `/application/job/:jobId` | Get applicants for a job | Recruiter |
| POST | `/application/status/:id/update` | Update application status | Recruiter |
| PUT | `/application/status/:id` | Update application status | Recruiter |

Also available with the same behavior under:

- `/api/v1/applications`

### Contact

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/contact` | Submit contact form | Public |

### API Docs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/docs` | JSON summary of API routes and query support | Public |

## Important Request Details

### `POST /user/register`

- Content type: `multipart/form-data`
- Required fields:
  - `fullname`
  - `email`
  - `phonenumber`
  - `password`
  - `role`
- If role is `user`, resume upload is required

### `POST /user/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

### `POST /job/post`

Request body example:

```json
{
  "title": "Frontend Developer",
  "description": "Build UI applications",
  "requirements": "React,JavaScript,HTML,CSS",
  "salaryMin": 800000,
  "salaryMax": 1200000,
  "location": "Bangalore",
  "jobtype": "Full Time",
  "experience": 2,
  "position": 3,
  "companyId": "COMPANY_ID"
}
```

### `GET /job`

Query params:

- `keyword`
- `title`
- `location`
- `salary`
- `page`
- `limit`

Search behavior:

- `keyword` or `title` searches title, description, and requirements
- `location` filters jobs by location
- `salary` returns jobs with minimum salary greater than or equal to the given value

Pagination response includes:

- `page`
- `limit`
- `total`
- `totalPages`
- `hasNextPage`
- `hasPrevPage`

### `GET /job/getadminjobs`

Query params:

- `page`
- `limit`
- `includeDeleted=true`

### `GET /application/get`

Query params:

- `page`
- `limit`

### `GET /application/:id/applicant`

Query params:

- `page`
- `limit`

### `POST /application/status/:id/update`

Request body:

```json
{
  "status": "Accepted"
}
```

Allowed values:

- `Pending`
- `Accepted`
- `Rejected`

## Role Permissions

| Action | User | Recruiter |
|--------|------|-----------|
| Register account | Yes | Yes |
| Login/logout | Yes | Yes |
| Update own profile | Yes | Yes |
| Upload/update resume | Yes | No |
| View jobs | Yes | Yes |
| Apply to job | Yes | No |
| View own applications | Yes | No |
| Create company | No | Yes |
| Post jobs | No | Yes |
| Delete own jobs | No | Yes |
| View own posted jobs | No | Yes |
| View job applicants | No | Yes |
| Update application status | No | Yes |

## Assumptions

- MongoDB is running and accessible using the URI in `.env`
- Backend runs from the `backend` folder
- JWT token is stored in a cookie named `token`
- Cookie-based auth is required for protected endpoints
- Role values used by the backend are `user` and `recruiter`
- `student` is normalized to `user` in the current code
- Resume upload is mandatory when registering a `user`
- Resume upload is not required for `recruiter`
- Resume files are stored locally, not on cloud storage
- `/company/get` returns all companies for public requests and user-linked companies when auth exists
- Company update currently does not enforce ownership check
- Jobs and applications have duplicate singular/plural route prefixes for compatibility
- Deleted jobs are soft deleted, not permanently removed from MongoDB
- Public job listing excludes soft-deleted jobs
- Recruiter job listing excludes deleted jobs unless `includeDeleted=true`
- If database connection fails, most API routes return `503`, except `/health` and `/contact`

## Main Tech Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- Multer
- CORS

## Run Command

```bash
cd backend
npm run dev
```

## Test Command

```bash
cd backend
npm test
```
