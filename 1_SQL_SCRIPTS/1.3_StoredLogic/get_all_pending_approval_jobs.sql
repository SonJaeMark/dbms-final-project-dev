/*
Procedure: get_all_pending_approval_jobs
Purpose: Returns jobs pending admin approval.
Parameters: none
Returns: SETOF record of jobs
Security: Admin only.
*/
CREATE OR REPLACE FUNCTION public.get_all_pending_approval_jobs()
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

