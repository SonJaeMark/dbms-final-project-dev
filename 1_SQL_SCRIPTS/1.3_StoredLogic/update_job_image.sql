/*
Procedure: update_job_image
Purpose: Updates a job image's metadata or file URL.
Parameters:
- p_image_id uuid: Image ID
- p_job_id uuid: Job ID owner
- p_file_url text
- p_caption text
- p_display_order integer
Returns: void or updated image row.
Security: Only owning lister may update its images.
*/
CREATE OR REPLACE FUNCTION public.update_job_image(
  p_image_id uuid,
  p_job_id uuid,
  p_file_url text,
  p_caption text,
  p_display_order integer
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

