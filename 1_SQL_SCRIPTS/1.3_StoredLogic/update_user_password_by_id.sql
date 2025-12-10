/*
Procedure: update_user_password_by_id
Purpose: Updates a user's password hash and salt.
Parameters:
- p_user_id uuid
- p_hash_password text
- p_salt_password text
Returns: void
Security: Admin only; never store cleartext.
*/
CREATE OR REPLACE FUNCTION public.update_user_password_by_id(
  p_user_id uuid,
  p_hash_password text,
  p_salt_password text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

