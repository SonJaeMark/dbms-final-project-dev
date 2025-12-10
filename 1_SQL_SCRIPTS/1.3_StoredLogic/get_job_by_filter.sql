/*
Procedure: get_job_by_filter
Purpose: Returns job IDs matching optional filters.
Parameters: All nullable
- p_title text
- p_location text
- p_category text
- p_min_salary numeric
- p_max_salary numeric
- p_work_type text
- p_limit integer
- p_offset integer
Returns: SETOF record with at least {id} or job_id.
Security: Public readable for published jobs.
*/
CREATE OR REPLACE FUNCTION public.get_job_by_filter(
  p_title text,
  p_location text,
  p_category text,
  p_min_salary numeric,
  p_max_salary numeric,
  p_work_type text,
  p_limit integer,
  p_offset integer
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

