/*
Procedure: delete_job_return
Purpose:
  Marks a job as deleted (soft delete) and returns whether the operation succeeded.

Parameters:
  p_job_id uuid - The job to delete.
  p_lister_id uuid - The owner lister ID.

Returns:
  boolean - true if the job was successfully marked as deleted, false otherwise.

Security:
  - Only the owning lister may delete the job.
  - Enforce with RLS: jobs.lister_id = auth.uid()
*/

CREATE OR REPLACE FUNCTION public.delete_job_return(
  p_job_id uuid,
  p_lister_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
    rows_updated int;
BEGIN
    -- ✅ Soft delete: mark job as 'deleted'
    UPDATE public.jobs
    SET 
        status = 'deleted',
        updated_at = NOW()
    WHERE id = p_job_id
      AND lister_id = p_lister_id;

    GET DIAGNOSTICS rows_updated = ROW_COUNT;

    IF rows_updated > 0 THEN
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$;
