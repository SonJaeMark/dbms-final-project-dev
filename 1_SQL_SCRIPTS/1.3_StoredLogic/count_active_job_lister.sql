/*
Procedure: count_active_job_lister
Purpose: Returns count of active job lister users.
Parameters: none
Returns: integer
Security: Admin only.
*/
CREATE OR REPLACE FUNCTION public.count_active_job_lister()
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

