/*
Procedure: get_all_unread_notification
Purpose: Returns unread notifications for a user.
Parameters:
- p_user_id uuid
Returns: SETOF record of notifications
Security: Only owner can read.
*/
CREATE OR REPLACE FUNCTION public.get_all_unread_notification(
  p_user_id uuid
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

