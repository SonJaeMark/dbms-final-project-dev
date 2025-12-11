/*
Function: get_safe_user_by_email
Purpose:
  Returns non-sensitive user information for login or profile display.
  This function is safe to expose publicly because it excludes all password fields.

Parameters:
  p_email (text) - The email address to search for.

Returns:
  public.safe_user:
    - id UUID
    - email TEXT
    - full_name TEXT
    - role TEXT
    - status TEXT
    - created_at TIMESTAMPTZ
    - updated_at TIMESTAMPTZ

Notes:
  - Returns NULL if no user is found.
  - IMPORTANT: Make sure "safe_user" composite type exists.

Security:
  - Does NOT return password or sensitive authentication fields.
*/

CREATE OR REPLACE FUNCTION public.get_safe_user_by_email(
  p_email text
)
RETURNS public.safe_user
LANGUAGE plpgsql
AS $$
DECLARE
    result public.safe_user;
BEGIN
    SELECT 
        id,
        email,
        full_name,
        role,
        status,
        created_at,
        updated_at
    INTO result
    FROM public.users
    WHERE email = p_email;

    RETURN result;
END;
$$;
