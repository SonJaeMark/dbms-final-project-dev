/*
Procedure: update_job_image
Purpose:
  Updates a job image's metadata or file URL.

Parameters:
  p_image_id uuid - The ID of the image to update.
  p_job_id uuid - The job that owns this image.
  p_file_url text - New file URL.
  p_caption text - New caption.
  p_display_order integer - New display order.

Returns:
  public.job_images - The updated image row.

Security:
  - Only the owning job lister may update this image.
  - RLS should enforce: job_images.job_id → jobs.lister_id = auth.uid()
*/

CREATE OR REPLACE FUNCTION public.update_job_image(
  p_image_id uuid,
  p_job_id uuid,
  p_file_url text,
  p_caption text,
  p_display_order integer
)
RETURNS SETOF public.job_images
LANGUAGE plpgsql
AS $$
BEGIN
  -- ✅ Update only the correct image belonging to the job
  UPDATE public.job_images ji
  SET
    file_url = p_file_url,
    caption = p_caption,
    display_order = p_display_order
  WHERE ji.id = p_image_id
    AND ji.job_id = p_job_id;

  -- ✅ Return updated image
  RETURN QUERY
  SELECT
    ji.id,
    ji.job_id,
    ji.file_url,
    ji.caption,
    ji.display_order,
    ji.created_at
  FROM public.job_images ji
  WHERE ji.id = p_image_id
    AND ji.job_id = p_job_id;
END;
$$;
