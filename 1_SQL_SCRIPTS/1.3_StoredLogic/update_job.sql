/*
Procedure: update_job
Purpose:
  Updates a job's fields by job ID.

Parameters:
  p_job_id uuid - The ID of the job to update.
  p_title text
  p_category text
  p_description text
  p_location text
  p_rate_amount numeric
  p_rate_type text
  p_required_skills text
  p_salary_notes text
  p_status text
  p_vacancies_available integer
  p_work_schedule text
  p_work_type text

Returns:
  public.jobs - The updated job row.

Security:
  - Only the owning lister may update the job.
  - RLS should enforce: lister_id = auth.uid()
*/

CREATE OR REPLACE FUNCTION public.update_job(
  p_job_id uuid,
  p_title text,
  p_category text,
  p_description text,
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
RETURNS SETOF public.jobs
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.jobs
  SET
    location = p_location,
    title = p_title,
    description = p_description,
    category = p_category,
    work_type = p_work_type,
    work_schedule = p_work_schedule,
    rate_amount = p_rate_amount,
    rate_type = p_rate_type,
    salary_notes = p_salary_notes,
    vacancies_available = p_vacancies_available,
    required_skills = p_required_skills,
    status = p_status,
    updated_at = NOW()
  WHERE id = p_job_id
  RETURNING *;
END;
$$;
