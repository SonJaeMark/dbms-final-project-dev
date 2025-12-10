/*
Procedure: get_all_jobs_by_status_and_user_id
Purpose: Returns all jobs for a lister filtered by status.
Parameters:
- p_status text
- p_user_id uuid
Returns: SETOF record of jobs
Security: Only jobs belonging to user.
*/
CREATE OR REPLACE FUNCTION public.get_all_jobs_by_status_and_user_id(
  p_status text,
  p_user_id uuid
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

