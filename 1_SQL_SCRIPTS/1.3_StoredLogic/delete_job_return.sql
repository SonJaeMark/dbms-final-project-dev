/*
Procedure: delete_job_return
Purpose: Deletes a job and its images, returning a summary result.
Parameters:
- p_job_id uuid
- p_lister_id uuid
Returns: jsonb with deletion summary (e.g., {deleted_images, deleted_job: true}).
Security: Only owning lister may delete; consider cascading deletes.
*/
CREATE OR REPLACE FUNCTION public.delete_job_return(
  p_job_id uuid,
  p_lister_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

