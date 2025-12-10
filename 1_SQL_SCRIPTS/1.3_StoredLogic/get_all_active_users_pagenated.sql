/*
Procedure: get_all_active_users_pagenated
Purpose: Returns active users with limit/offset pagination.
Parameters:
- p_limit integer
- p_offset integer
Returns: SETOF record of users
Security: Admin only.
*/
CREATE OR REPLACE FUNCTION public.get_all_active_users_pagenated(
  p_limit integer,
  p_offset integer
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

