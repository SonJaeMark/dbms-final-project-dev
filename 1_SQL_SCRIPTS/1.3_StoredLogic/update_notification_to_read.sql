/*
Procedure: update_notification_to_read
Purpose:
  Marks a specific notification as read for the owner.

Parameters:
  p_notif_id uuid - The notification to mark as read.
  p_user_id  uuid - The owner of the notification.

Returns:
  uuid - The ID of the notification that was marked as read.
         Returns NULL if no matching notification exists.

Security:
  - Only the owner (p_user_id) can update their own notifications.
  - Should be enforced with RLS.
*/

CREATE OR REPLACE FUNCTION public.update_notification_to_read(
  p_notif_id uuid,
  p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid;
BEGIN
  UPDATE public.notifications
  SET read = true
  WHERE id = p_notif_id
    AND user_id = p_user_id
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;
