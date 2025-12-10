/*
Procedure: count_published_job
Purpose: Returns count of published jobs.
Parameters: none
Returns: integer
Security: Admin only or public depending on needs.
*/
CREATE OR REPLACE FUNCTION public.count_published_job()
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

