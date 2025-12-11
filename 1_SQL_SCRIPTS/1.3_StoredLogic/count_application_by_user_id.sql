/*
Procedure: count_application_by_user_id
Purpose:
  Returns the number of job applications created by a specific seeker.

Parameters:
  p_seeker_id uuid - The ID of the seeker.

Returns:
  integer - Total number of applications by the seeker.

Behavior:
  - Counts rows in public.applications where seeker_id = p_seeker_id.

Security:
  - Should be protected by RLS so that only:
      • the owner (seeker), OR
      • admins
    can read this information.
*/

CREATE OR REPLACE FUNCTION public.count_application_by_user_id(
  p_seeker_id uuid
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  total integer;
BEGIN
  SELECT COUNT(*)
  INTO total
  FROM public.applications
  WHERE seeker_id = p_seeker_id;

  RETURN total;
END;
$$;
