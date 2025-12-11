/*
Procedure: get_resume_by_user_id
Purpose:
  Returns all resumes belonging to a specific seeker/user.

Parameters:
  p_user_id uuid - The user's ID (seeker_id).

Returns:
  SETOF public.resumes - All resume rows for the user.

Behavior:
  - Fetches from public.resumes
    where seeker_id = p_user_id
  - Sorted with newest resumes first.

Security:
  - Must be protected by RLS:
      • Only the owner (seeker) OR
      • Admin users
    can view these resumes.
*/

CREATE OR REPLACE FUNCTION public.get_resume_by_user_id(
  p_user_id uuid
)
RETURNS SETOF public.resumes
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT r.*
  FROM public.resumes r
  WHERE r.seeker_id = p_user_id
  ORDER BY r.created_at DESC;
END;
$$;
