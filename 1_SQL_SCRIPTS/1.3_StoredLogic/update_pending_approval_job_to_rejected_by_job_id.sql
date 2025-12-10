/*
Procedure: update_pending_approval_job_to_rejected_by_job_id
Purpose: Rejects a pending job by id.
Parameters:
- p_job_id uuid
Returns: void or updated job row
Security: Admin only.
*/
CREATE OR REPLACE FUNCTION public.update_pending_approval_job_to_rejected_by_job_id(
  p_job_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

