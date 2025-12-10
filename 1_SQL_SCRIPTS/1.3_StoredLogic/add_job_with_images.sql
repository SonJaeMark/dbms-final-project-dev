/*
Procedure: add_job_with_images
Purpose: Creates a new job and inserts associated images in one atomic operation.
Parameters:
- p_title text: Job title
- p_category text: Job category
- p_description text: Job description
- p_images jsonb: Array of image objects {file_url, caption, display_order}
- p_lister_id uuid: User ID of job lister
- p_location text: Job location
- p_rate_amount numeric: Salary amount
- p_rate_type text: Salary rate type ('monthly','daily','hourly',...)
- p_required_skills text: Comma-separated skills
- p_salary_notes text: Optional notes
- p_status text: Job status ('draft','pending_approval','published','rejected')
- p_vacancies_available integer: Number of vacancies
- p_work_schedule text: Work schedule
- p_work_type text: Work type ('Remote','Onsite','Hybrid')
Returns: jsonb with keys {message, job_id}
Security: Enforce RLS so only the lister (p_lister_id) can create; consider SECURITY DEFINER with permission checks.
Example: supabase.rpc('add_job_with_images', { ... })
*/
CREATE OR REPLACE FUNCTION public.add_job_with_images(
  p_title text,
  p_category text,
  p_description text,
  p_images jsonb,
  p_lister_id uuid,
  p_location text,
  p_rate_amount numeric,
  p_rate_type text,
  p_required_skills text,
  p_salary_notes text,
  p_status text,
  p_vacancies_available integer,
  p_work_schedule text,
  p_work_type text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

