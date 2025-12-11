/*
Procedure: insert_resume_by_user_id
Purpose:
  Inserts a new resume for a seeker.

Parameters:
  p_file_url text   - Location of the uploaded resume file.
  p_seeker_id uuid  - Owner of the resume.
  p_summary text    - Short summary/description of experience.
  p_title text      - Resume title (e.g., "Software Engineer Resume").

Returns:
  uuid - The ID of the newly created resume row.

Behavior:
  - Creates a new entry in public.resumes.
  - Automatically sets created_at and updated_at timestamps.

Security:
  - Should be protected by RLS so only the seeker (p_seeker_id)
    can insert resumes for themselves.
*/

CREATE OR REPLACE FUNCTION public.insert_resume_by_user_id(
  p_file_url text,
  p_seeker_id uuid,
  p_summary text,
  p_title text
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.resumes (
    seeker_id,
    title,
    file_url,
    summary,
    created_at,
    updated_at
  )
  VALUES (
    p_seeker_id,
    p_title,
    p_file_url,
    p_summary,
    now(),
    now()
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;
