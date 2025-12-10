-- ============================
-- USERS
-- ============================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  password_salt text NOT NULL,
  full_name text,
  role text NOT NULL CHECK (
      role = ANY (ARRAY['admin', 'job_lister', 'job_seeker'])
  ),
  status text NOT NULL DEFAULT 'active' CHECK (
      status = ANY (ARRAY['active', 'deactivated'])
  ),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================
-- RESUMES
-- ============================
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id uuid NOT NULL REFERENCES users(id),
  title text,
  file_url text,
  summary text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================
-- JOBS
-- ============================
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lister_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  work_type text,
  location text,
  work_schedule text,
  rate_amount numeric NOT NULL,
  rate_type text NOT NULL CHECK (
      rate_type = ANY (
        ARRAY['hourly','daily','weekly','biweekly','monthly','per_project','per_call']
      )
  ),
  salary_notes text,
  vacancies_available int NOT NULL DEFAULT 1,
  required_skills text,
  status text NOT NULL DEFAULT 'draft' CHECK (
      status = ANY (
        ARRAY['draft','pending_approval','published','closed','taken','deleted','rejected']
      )
  ),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================
-- APPLICATIONS
-- ============================
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id),
  seeker_id uuid NOT NULL REFERENCES users(id),
  resume_id uuid REFERENCES resumes(id),
  cover_letter text,
  status text NOT NULL DEFAULT 'applied' CHECK (
      status = ANY (ARRAY['applied','accepted','rejected','cancelled'])
  ),
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================
-- JOB IMAGES
-- ============================
CREATE TABLE IF NOT EXISTS job_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id),
  file_url text NOT NULL,
  caption text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================
-- JOB LOGS
-- ============================
CREATE TABLE IF NOT EXISTS job_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id),
  actor_id uuid REFERENCES users(id),
  action text NOT NULL,
  details text,
  created_at timestamptz DEFAULT now()
);

-- ============================
-- NOTIFICATIONS
-- ============================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  type text NOT NULL,
  data jsonb,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
