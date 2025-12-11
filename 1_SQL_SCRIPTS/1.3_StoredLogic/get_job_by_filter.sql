/*
Procedure: get_job_by_filter
Purpose:
  Returns job IDs matching optional filters.

Parameters:
  p_title text - Partial title match (ILIKE)
  p_location text - Partial location match (ILIKE)
  p_category text - Exact category match
  p_min_salary numeric - Minimum rate_amount
  p_max_salary numeric - Maximum rate_amount
  p_work_type text - Exact work_type match
  p_limit integer - Number of rows to return
  p_offset integer - Rows to skip (pagination)

Returns:
  SETOF record with at least {id} (job_id)

Security:
  - Public readable; only jobs with status = 'published'
*/

CREATE OR REPLACE FUNCTION public.get_job_by_filter(
  p_title text,
  p_location text,
  p_category text,
  p_min_salary numeric,
  p_max_salary numeric,
  p_work_type text,
  p_limit integer,
  p_offset integer
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT j.id
  FROM public.jobs j
  WHERE j.status = 'published'
    AND (p_title IS NULL OR j.title ILIKE '%' || p_title || '%')
    AND (p_location IS NULL OR j.location ILIKE '%' || p_location || '%')
    AND (p_min_salary IS NULL OR j.rate_amount >= p_min_salary)
    AND (p_max_salary IS NULL OR j.rate_amount <= p_max_salary)
    AND (p_category IS NULL OR j.category = p_category)
    AND (p_work_type IS NULL OR j.work_type = p_work_type)
  ORDER BY j.created_at DESC
  LIMIT COALESCE(p_limit, 10)
  OFFSET COALESCE(p_offset, 0);
END;
$$;
