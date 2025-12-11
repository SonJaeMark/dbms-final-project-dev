/*
Procedure: insert_notification
Purpose:
  Inserts a notification entry for a user. Intended for system-triggered or
  admin-triggered actions, while ensuring that users can only read their own
  notifications via RLS.

Parameters:
  p_user_id uuid - The user who will receive the notification.
  p_type    text - Notification type (e.g., 'job_update', 'application_status').
  p_data    jsonb - Arbitrary JSON payload containing metadata.

Returns:
  uuid - The ID of the newly inserted notification row.

Security:
  - Should be used by admins or system actions.
  - RLS must ensure users can only SELECT their own notifications.
*/

CREATE OR REPLACE FUNCTION public.insert_notification(
  p_user_id uuid,
  p_type text,
  p_data jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    data,
    created_at
  )
  VALUES (
    p_user_id,
    p_type,
    p_data,
    now()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;
