/*
Procedure: get_application_status_applied_by_user_id
Purpose:
  Returns all applications with status 'applied' for the specified seeker.

Parameters:
  p_seeker_id uuid - ID of the seeker.

Returns:
  SETOF public.applications - All applied applications for that seeker.

Behavior:
  - Fetches rows from public.applications
    where seeker_id = p_seeker_id AND status = 'applied'
  - Sorted by the newest applied_at timestamp.

Security:
  - Must be protected by RLS:
      • Only the seeker themselves, OR
      • Admin users
    can read these results.
*/

CREATE OR REPLACE FUNCTION public.get_application_status_applied_by_user_id(
  p_seeker_id uuid
)
RETURNS SETOF public.applications
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM public.applications a
  WHERE a.seeker_id = p_seeker_id
    AND a.status = 'applied'
  ORDER BY a.applied_at DESC;
END;
$$;
