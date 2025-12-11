/*
Procedure: get_application_status_accepted_by_user_id
Purpose:
  Returns all accepted applications for the given seeker.

Parameters:
  p_seeker_id uuid - The seeker whose accepted applications will be returned.

Returns:
  SETOF public.applications

Behavior:
  - Fetches all rows from public.applications
    where seeker_id = p_seeker_id AND status = 'accepted'
  - Sorted by most recent applied_at first.

Security:
  - Should be protected by RLS so only:
      • The owner (seeker), OR
      • Admin users
    can read these records.
*/

CREATE OR REPLACE FUNCTION public.get_application_status_accepted_by_user_id(
  p_seeker_id uuid
)
RETURNS SETOF public.applications
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.*
  FROM public.applications a
  WHERE a.seeker_id = p_seeker_id
    AND a.status = 'accepted'
  ORDER BY a.applied_at DESC;
END;
$$;
