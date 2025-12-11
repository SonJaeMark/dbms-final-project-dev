/*
Procedure: insert_application_status_applied_by_job_id
Purpose:
  Creates a new job application with status 'applied'.
  This is used when a job seeker applies to a job for the first time.

Parameters:
  p_cover_letter text   - Optional cover letter.
  p_job_id uuid          - Job being applied to.
  p_resume_id uuid       - Resume submitted with the application.
  p_seeker_id uuid       - The job seeker submitting the application.

Returns:
  uuid - The ID of the newly created application.

Behavior:
  - Inserts into public.applications
  - Sets status = 'applied'
  - Sets applied_at and updated_at timestamps.

Security:
  - Should be protected by RLS: only the seeker (p_seeker_id) 
    can insert an application for themselves.
*/

CREATE OR REPLACE FUNCTION public.insert_application_status_applied_by_job_id(
  p_cover_letter text,
  p_job_id uuid,
  p_resume_id uuid,
  p_seeker_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.applications (
    job_id,
    seeker_id,
    resume_id,
    cover_letter,
    status,
    applied_at,
    updated_at
  )
  VALUES (
    p_job_id,
    p_seeker_id,
    p_resume_id,
    p_cover_letter,
    'applied',
    now(),
    now()
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;
