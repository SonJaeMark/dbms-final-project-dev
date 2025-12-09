// login-handler.js
import { supabase } from "../core/supabase-client.js";
import { verifyPassword } from "../security/password.js";

/**
 * Logs in a user by checking email + salted PBKDF2 hash.
 * @param {string} email
 * @param {string} password
 * @returns {Object} { success, message, data }
 */
export async function loginUser(email, password) {
  try {
    // 1. Fetch user by email to get password hash and salt for verification
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("id, email, full_name, password_hash, password_salt, role, status")
      .eq("email", email)
      .maybeSingle();

    if (findError) {
      console.error("Login Lookup Error:", findError);
      return { success: false, message: "Database error while checking email." };
    }

    if (!user) {
      return { success: false, message: "Email not found." };
    }

    if (user.status === "deactivated") {
      return { success: false, message: "Your account is deactivated." };
    }

    // 2. Verify password using stored salt + PBKDF2
    const passwordValid = await verifyPassword(
      password,
      user.password_salt,
      user.password_hash
    );

    if (!passwordValid) {
      return { success: false, message: "Incorrect password." };
    }

    // 3. Get full user info using RPC call (includes created_at, updated_at, etc.)
    const { data: fullUserData, error: rpcError } = await supabase
      .rpc('get_safe_user_by_email', { p_email: email });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      // Fallback to basic user data if RPC fails
      return {
        success: true,
        message: "Login successful!",
        data: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          status: user.status
        }
      };
    }

    if (!fullUserData || fullUserData.length === 0) {
      console.warn("RPC returned no data, using fallback");
      // Fallback to basic user data
      return {
        success: true,
        message: "Login successful!",
        data: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          status: user.status
        }
      };
    }

    // 4. Login successful - return full user data
    const userInfo = Array.isArray(fullUserData) ? fullUserData[0] : fullUserData;
    
    return {
      success: true,
      message: "Login successful!",
      data: {
        id: userInfo.id,
        email: userInfo.email,
        full_name: userInfo.full_name,
        role: userInfo.role,
        status: userInfo.status,
        created_at: userInfo.created_at,
        updated_at: userInfo.updated_at
      }
    };

  } catch (err) {
    console.error("Login Handler Error:", err);
    return { success: false, message: "Unexpected server error." };
  }
}
