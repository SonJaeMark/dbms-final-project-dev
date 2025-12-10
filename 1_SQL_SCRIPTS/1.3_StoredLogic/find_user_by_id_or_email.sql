/*
Procedure: find_user_by_id_or_email
Purpose: Returns users by id or email fragment.
Parameters:
- p_search text
Returns: SETOF record of users
Security: Admin only.
*/
CREATE OR REPLACE FUNCTION public.find_user_by_id_or_email(
  p_search text
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

