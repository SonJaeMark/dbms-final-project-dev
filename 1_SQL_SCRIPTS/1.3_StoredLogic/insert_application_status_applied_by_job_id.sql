/*
Procedure: insert_application_status_applied_by_job_id
Purpose: Inserts a new application for a job with status 'applied'.
Parameters:
- p_cover_letter text
- p_job_id uuid
- p_resume_id uuid
- p_seeker_id uuid
Returns: integer application id or jsonb with id.
Security: Only the seeker themselves can create their application.
*/
CREATE OR REPLACE FUNCTION public.insert_application_status_applied_by_job_id(
  p_cover_letter text,
  p_job_id uuid,
  p_resume_id uuid,
  p_seeker_id uuid
)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

