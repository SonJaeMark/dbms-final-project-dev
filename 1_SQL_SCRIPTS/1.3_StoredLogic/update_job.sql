/*
Procedure: update_job
Purpose: Updates job fields by job ID.
Parameters:
- p_job_id uuid: Job ID
- p_title text
- p_category text
- p_description text
- p_location text
- p_rate_amount numeric
- p_rate_type text
- p_required_skills text
- p_salary_notes text
- p_status text
- p_vacancies_available integer
- p_work_schedule text
- p_work_type text
Returns: void or updated row; recommended to return the updated job row.
Security: Only the owning lister may update.
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
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

