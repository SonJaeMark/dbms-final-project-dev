/*
Procedure: update_notification_to_read
Purpose: Marks a notification as read.
Parameters:
- p_notif_id uuid
- p_user_id uuid
Returns: void or updated row
Security: Only owner can update.
*/
CREATE OR REPLACE FUNCTION public.update_notification_to_read(
  p_notif_id uuid,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

