/*
Procedure: count_application_by_user_id
Purpose: Returns count of applications for a seeker.
Parameters:
- p_seeker_id uuid
Returns: integer
Security: Only owner or admins may read.
*/
CREATE OR REPLACE FUNCTION public.count_application_by_user_id(
  p_seeker_id uuid
)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

