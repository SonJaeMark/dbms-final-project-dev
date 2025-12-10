/*
Procedure: exec_sql
Purpose: Executes a raw SQL script (DDL/DML). Used by tooling to bootstrap schema/data.
Parameters:
- sql_script text
Returns: jsonb summary or text
Security: Highly sensitive; restrict to admins. Consider parsing and whitelisting.
*/
CREATE OR REPLACE FUNCTION public.exec_sql(
  sql_script text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Not implemented';
END;
$$;

