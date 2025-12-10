/*
Procedure: insert_resume_by_user_id
Purpose: Inserts a resume for a seeker.
Parameters:
- p_file_url text
- p_seeker_id uuid
- p_summary text
- p_title text
Returns: integer resume id or row.
Security: Only owner can insert.
*/
CREATE OR REPLACE FUNCTION public.insert_resume_by_user_id(
  p_file_url text,
  p_seeker_id uuid,
  p_summary text,
  p_title text
)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

