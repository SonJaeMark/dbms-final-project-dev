/*
Procedure: add_job_with_images
Purpose:
  Creates a new job and inserts associated images in one atomic operation.

Parameters:
  p_title text: Job title
  p_category text: Job category
  p_description text: Job description
  p_images jsonb: Array of image objects {file_url, caption, display_order}
  p_lister_id uuid: User ID of job lister
  p_location text: Job location
  p_rate_amount numeric: Salary amount
  p_rate_type text: Salary rate type ('monthly','daily','hourly',...)
  p_required_skills text: Comma-separated skills
  p_salary_notes text: Optional notes
  p_status text: Job status ('draft','pending_approval','published','rejected')
  p_vacancies_available integer: Number of vacancies
  p_work_schedule text: Work schedule
  p_work_type text: Work type ('Remote','Onsite','Hybrid')

Returns:
  jsonb: { message text, job_id uuid | null }

Security:
  - Only the lister (p_lister_id) should be allowed to create jobs.
  - Consider SECURITY DEFINER if calling from RLS-restricted users.
*/

CREATE OR REPLACE FUNCTION public.add_job_with_images(
  p_title text,
  p_category text,
  p_description text,
  p_images jsonb,
  p_lister_id uuid,
  p_location text,
  p_rate_amount numeric,
  p_rate_type text,
  p_required_skills text,
  p_salary_notes text,
  p_status text,
  p_vacancies_available integer,
  p_work_schedule text,
  p_work_type text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    v_job_id uuid;
    v_img jsonb;
BEGIN
    -- ✅ Insert job
    INSERT INTO public.jobs (
        lister_id,
        title,
        description,
        category,
        work_type,
        location,
        work_schedule,
        rate_amount,
        rate_type,
        salary_notes,
        vacancies_available,
        required_skills,
        status
    )
    VALUES (
        p_lister_id,
        p_title,
        p_description,
        p_category,
        p_work_type,
        p_location,
        p_work_schedule,
        p_rate_amount,
        p_rate_type,
        p_salary_notes,
        p_vacancies_available,
        p_required_skills,
        p_status
    )
    RETURNING id INTO v_job_id;

    -- ✅ Insert images (if any)
    IF p_images IS NOT NULL THEN
        FOR v_img IN SELECT * FROM jsonb_array_elements(p_images)
        LOOP
            INSERT INTO public.job_images (
                job_id,
                file_url,
                caption,
                display_order
            )
            VALUES (
                v_job_id,
                v_img->>'file_url',
                v_img->>'caption',
                COALESCE((v_img->>'display_order')::int, 0)
            );
        END LOOP;
    END IF;

    -- ✅ Success response
    RETURN jsonb_build_object(
        'message', 'Job created successfully',
        'job_id', v_job_id
    );

EXCEPTION
    WHEN others THEN
        RETURN jsonb_build_object(
            'message', sqlerrm,
            'job_id', NULL
        );
END;
$$;
