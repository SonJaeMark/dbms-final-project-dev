/*
Procedure: update_application_status_to_cancelled_by_application_id
Purpose:
  Updates an existing application and marks it as 'cancelled'.
  Used by seekers who want to cancel their own job application.

Parameters:
  p_application_id uuid - The application to cancel.

Returns:
  uuid - The ID of the cancelled application.

Behavior:
  - Updates status to 'cancelled'
  - Updates updated_at timestamp
  - Does not throw if application does not exist (returns the same ID)

Security:
  - Should be protected by RLS: only the owner (seeker) may cancel.
*/

CREATE OR REPLACE FUNCTION public.update_application_status_to_cancelled_by_application_id(
  p_application_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.applications
  SET 
    status = 'cancelled',
    updated_at = now()
  WHERE id = p_application_id;

  RETURN p_application_id;
END;
$$;
