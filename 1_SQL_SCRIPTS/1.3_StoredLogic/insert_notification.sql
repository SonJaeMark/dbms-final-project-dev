/*
Procedure: insert_notification
Purpose: Inserts a notification for a user.
Parameters:
- p_user_id uuid
- p_type text
- p_data jsonb
Returns: uuid notification id or row
Security: Admins or system actions; ensure user can only read own notifications.
*/
CREATE OR REPLACE FUNCTION public.insert_notification(
  p_user_id uuid,
  p_type text,
  p_data jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

