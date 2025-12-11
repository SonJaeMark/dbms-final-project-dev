/*
Procedure: get_job_join_job_image_by_job_id
Purpose:
  Returns a job row joined with its images flattened across rows.

Parameters:
  p_job_id uuid - The ID of the job.

Returns:
  SETOF record with:
    - Job fields: job_id, lister_id, title, description, category, work_type, location, work_schedule, rate_amount, rate_type, salary_notes, vacancies_available, required_skills, status, job_created_at, job_updated_at
    - Image fields: image_id, file_url, caption, display_order, image_created_at

Security:
  - Public readable only for published jobs.
*/

CREATE OR REPLACE FUNCTION public.get_job_join_job_image_by_job_id(
  p_job_id uuid
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id AS job_id,
    j.lister_id,
    j.title,
    j.description,
    j.category,
    j.work_type,
    j.location,
    j.work_schedule,
    j.rate_amount,
    j.rate_type,
    j.salary_notes,
    j.vacancies_available,
    j.required_skills,
    j.status,
    j.created_at AS job_created_at,
    j.updated_at AS job_updated_at,
    i.id AS image_id,
    i.file_url,
    i.caption,
    i.display_order,
    i.created_at AS image_created_at
  FROM public.jobs j
  LEFT JOIN public.job_images i
    ON j.id = i.job_id
  WHERE j.id = p_job_id
    AND j.status = 'published'  -- enforce public-readable restriction
  ORDER BY i.display_order ASC, i.created_at ASC;
END;
$$;
