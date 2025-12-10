/*
Procedure: update_application_status_to_cancelled_by_application_id
Purpose: Updates an application status to 'cancelled' by application id.
Parameters:
- p_application_id uuid
Returns: void or updated row.
Security: Only owner seeker may cancel.
*/
CREATE OR REPLACE FUNCTION public.update_application_status_to_cancelled_by_application_id(
  p_application_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

