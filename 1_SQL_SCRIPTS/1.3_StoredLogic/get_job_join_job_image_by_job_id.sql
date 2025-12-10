/*
Procedure: get_job_join_job_image_by_job_id
Purpose: Returns a job row joined with its images flattened across rows.
Parameters:
- p_job_id uuid
Returns: SETOF record with job fields and image fields per row.
Security: Public readable for published jobs.
*/
CREATE OR REPLACE FUNCTION public.get_job_join_job_image_by_job_id(
  p_job_id uuid
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

