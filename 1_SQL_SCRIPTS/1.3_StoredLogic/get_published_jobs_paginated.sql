/*
Procedure: get_published_jobs_paginated
Purpose:
  Returns published jobs with pagination and total counts.

Parameters:
  p_page integer - 1-indexed page
  p_page_size integer - items per page

Returns:
  SETOF record including:
    - All job fields
    - images JSON array
    - total_count integer
    - total_pages integer

Security:
  - Public readable; only jobs with status = 'published'.
*/

CREATE OR REPLACE FUNCTION public.get_published_jobs_paginated(
  p_page integer,
  p_page_size integer
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
DECLARE
    v_offset integer;
    v_total_count bigint;
    v_total_pages integer;
BEGIN
    -- Sanitize pagination
    IF p_page < 1 THEN
        p_page := 1;
    END IF;

    IF p_page_size < 1 THEN
        p_page_size := 10;
    END IF;

    v_offset := (p_page - 1) * p_page_size;

    -- Total published jobs
    SELECT COUNT(*) INTO v_total_count
    FROM public.jobs j
    WHERE j.status = 'published';

    -- Compute total pages
    v_total_pages := CEIL(v_total_count::numeric / p_page_size)::integer;

    -- Return paginated jobs with images JSON
    RETURN QUERY
    SELECT
        j.id,
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
        j.created_at,
        j.updated_at,
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', ji.id,
                        'file_url', ji.file_url,
                        'caption', ji.caption,
                        'display_order', ji.display_order,
                        'created_at', ji.created_at
                    )
                    ORDER BY ji.display_order ASC
                )
                FROM public.job_images ji
                WHERE ji.job_id = j.id
            ),
            '[]'::jsonb
        ) AS images,
        v_total_count AS total_count,
        v_total_pages AS total_pages
    FROM public.jobs j
    WHERE j.status = 'published'
    ORDER BY j.created_at DESC
    LIMIT p_page_size
    OFFSET v_offset;
END;
$$;
