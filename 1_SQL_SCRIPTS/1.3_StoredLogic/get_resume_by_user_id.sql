/*
Procedure: get_resume_by_user_id
Purpose: Returns resume rows for a user.
Parameters:
- p_user_id uuid
Returns: SETOF record of resumes
Security: Owner or admins.
*/
CREATE OR REPLACE FUNCTION public.get_resume_by_user_id(
  p_user_id uuid
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

