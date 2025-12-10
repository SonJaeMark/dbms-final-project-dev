/*
Procedure: get_safe_user_by_email
Purpose: Returns non-sensitive user info by email for login.
Parameters:
- p_email text
Returns: SETOF record {id, email, full_name, role, status, created_at, updated_at}
Security: Exclude password fields; public callable.
*/
CREATE OR REPLACE FUNCTION public.get_safe_user_by_email(
  p_email text
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

