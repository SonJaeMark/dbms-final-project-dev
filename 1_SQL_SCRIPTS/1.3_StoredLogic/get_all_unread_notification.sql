/*
Procedure: get_all_unread_notification
Purpose:
  Returns all unread notifications for a specific user.

Parameters:
  p_user_id uuid - The user whose unread notifications will be returned.

Returns:
  SETOF public.notifications - All unread notifications for the user.

Behavior:
  - Fetches notifications where user_id = p_user_id AND read = false.
  - Sorted by newest created_at first.

Security:
  - Only the owner can read their notifications.
  - Should be enforced with RLS.
*/

CREATE OR REPLACE FUNCTION public.get_all_unread_notification(
  p_user_id uuid
)
RETURNS SETOF public.notifications
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT n.*
  FROM public.notifications n
  WHERE n.user_id = p_user_id
    AND n.read = false
  ORDER BY n.created_at DESC;
END;
$$;
