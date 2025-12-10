/*
Procedure: update_active_user_to_deactivate_by_user_id
Purpose: Deactivates a user account by id.
Parameters:
- p_user_id uuid
Returns: void or updated user row
Security: Admin only.
*/
CREATE OR REPLACE FUNCTION public.update_active_user_to_deactivate_by_user_id(
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

