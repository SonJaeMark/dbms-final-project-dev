/*
Procedure: get_application_status_applied_by_user_id
Purpose: Returns applied applications for a seeker.
Parameters:
- p_seeker_id uuid
Returns: SETOF record of applications
Security: Owner or admins.
*/
CREATE OR REPLACE FUNCTION public.get_application_status_applied_by_user_id(
  p_seeker_id uuid
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

