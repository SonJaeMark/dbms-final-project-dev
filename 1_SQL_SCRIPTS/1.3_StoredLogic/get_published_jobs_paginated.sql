/*
Procedure: get_published_jobs_paginated
Purpose: Returns published jobs with pagination and total counts.
Parameters:
- p_page integer: 1-indexed page
- p_page_size integer: items per page
Returns: SETOF record including job fields plus total_count, total_pages metadata.
Security: Public readable; ensure only published status.
*/
CREATE OR REPLACE FUNCTION public.get_published_jobs_paginated(
  p_page integer,
  p_page_size integer
)
RETURNS SETOF record
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

