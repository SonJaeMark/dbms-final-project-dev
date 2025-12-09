// register-handler.js
import { supabase } from "../core/supabase-client.js"; 
import { hashPassword } from "../security/password.js";

/**
 * Registers a new user into Supabase "users" table.
 * @param {Object} payload
 * @param {string} payload.full_name
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.role  - ('job_lister', 'job_seeker')
 * @returns {Object} result - { success, message, data }
 */
export async function registerUser({ full_name, email, password, role }) {
  try {
    const { salt, hash } = await hashPassword(password);

    const { data, error } = await supabase
      .from("users")
      .insert({
        full_name,
        email,
        password_hash: hash,
        password_salt: salt,
        role,
        status: "active"
      })
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error("Supabase Insert Error:", err);
    return { success: false, message: err.message };
  }
}
