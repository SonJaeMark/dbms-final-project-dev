// admin-handler.js
import { supabase } from "../core/supabase-client.js";

/**
 * Gets all pending approval jobs
 * @returns {Object} { success, data, error }
 */
export async function getAllPendingApprovalJobs() {
  try {
    const { data, error } = await supabase.rpc('get_all_pending_approval_jobs');

    if (error) {
      console.error("Error fetching pending jobs:", error);
      return {
        success: false,
        data: null,
        error: error.message || error.details || "Failed to fetch pending jobs"
      };
    }

    return {
      success: true,
      data: data || [],
      error: null
    };
  } catch (err) {
    console.error("Get Pending Jobs Handler Error:", err);
    return {
      success: false,
      data: null,
      error: "Unexpected server error."
    };
  }
}

/**
 * Updates a pending approval job to published
 * @param {string} p_job_id - Job ID
 * @returns {Object} { success, data, error }
 */
export async function updatePendingJobToPublished(p_job_id) {
  try {
    const { data, error } = await supabase.rpc('update_pending_approval_job_to_published_by_job_id', {
      p_job_id
    });

    if (error) {
      console.error("Error updating job to published:", error);
      return {
        success: false,
        data: null,
        error: error.message || error.details || "Failed to update job"
      };
    }

    return {
      success: true,
      data: data,
      error: null
    };
  } catch (err) {
    console.error("Update Job Handler Error:", err);
    return {
      success: false,
      data: null,
      error: "Unexpected server error."
    };
  }
}

/**
 * Updates a pending approval job to rejected
 * @param {string} p_job_id - Job ID
 * @returns {Object} { success, data, error }
 */
export async function updatePendingJobToRejected(p_job_id) {
  try {
    const { data, error } = await supabase.rpc('update_pending_approval_job_to_rejected_by_job_id', {
      p_job_id
    });

    if (error) {
      console.error("Error updating job to rejected:", error);
      return {
        success: false,
        data: null,
        error: error.message || error.details || "Failed to reject job"
      };
    }

    return {
      success: true,
      data: data,
      error: null
    };
  } catch (err) {
    console.error("Reject Job Handler Error:", err);
    return {
      success: false,
      data: null,
      error: "Unexpected server error."
    };
  }
}

/**
 * Gets all active users with pagination
 * @param {number} p_limit - number of users to fetch
 * @param {number} p_offset - offset for pagination
 * @returns {Object} { success, data, error }
 */
export async function getActiveUsersPaginated(p_limit = 10, p_offset = 0) {
  try {
    const { data, error } = await supabase.rpc('get_all_active_users_pagenated', {
      p_limit,
      p_offset
    });

    if (error) {
      console.error("Error fetching users:", error);
      return { success: false, data: null, error: error.message || "Failed to fetch users" };
    }

    return { success: true, data: data || [], error: null };
  } catch (err) {
    console.error("Get Users Handler Error:", err);
    return { success: false, data: null, error: "Unexpected server error." };
  }
}

/**
 * Finds user by id or email
 * @param {string} p_search - id or email fragment
 * @returns {Object} { success, data, error }
 */
export async function findUserByIdOrEmail(p_search) {
  try {
    const { data, error } = await supabase.rpc('find_user_by_id_or_email', { p_search });

    if (error) {
      console.error("Error searching user:", error);
      return { success: false, data: null, error: error.message || "Failed to search user" };
    }

    return { success: true, data: data || [], error: null };
  } catch (err) {
    console.error("Find User Handler Error:", err);
    return { success: false, data: null, error: "Unexpected server error." };
  }
}

/**
 * Deactivates an active user
 * @param {string} p_user_id - user id
 * @returns {Object} { success, data, error }
 */
export async function deactivateUserById(p_user_id) {
  try {
    const { data, error } = await supabase.rpc('update_active_user_to_deactivate_by_user_id', {
      p_user_id
    });

    if (error) {
      console.error("Error deactivating user:", error);
      return { success: false, data: null, error: error.message || "Failed to deactivate user" };
    }

    return { success: true, data: data, error: null };
  } catch (err) {
    console.error("Deactivate User Handler Error:", err);
    return { success: false, data: null, error: "Unexpected server error." };
  }
}

/**
 * Updates user password by id (hash and salt must be provided)
 * @param {string} p_user_id - user id
 * @param {string} p_hash_password - hashed password (hex/base)
 * @param {string} p_salt_password - salt (hex/base)
 * @returns {Object} { success, data, error }
 */
export async function updateUserPasswordById(p_user_id, p_hash_password, p_salt_password) {
  try {
    const { data, error } = await supabase.rpc('update_user_password_by_id', {
      p_user_id,
      p_hash_password,
      p_salt_password
    });

    if (error) {
      console.error("Error updating user password:", error);
      return { success: false, data: null, error: error.message || "Failed to update password" };
    }

    return { success: true, data: data, error: null };
  } catch (err) {
    console.error("Update User Password Handler Error:", err);
    return { success: false, data: null, error: "Unexpected server error." };
  }
}

