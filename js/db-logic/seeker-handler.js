// seeker-handler.js
import { supabase } from "../core/supabase-client.js";

export async function insertApplicationStatusApplied({ p_cover_letter, p_job_id, p_resume_id, p_seeker_id }) {
  try {
    const { data, error } = await supabase.rpc("insert_application_status_applied_by_job_id", {
      p_cover_letter,
      p_job_id,
      p_resume_id,
      p_seeker_id
    });
    if (error) {
      console.error("Error applying to job:", error);
      return { success: false, data: null, error: error.message || "Failed to apply" };
    }
    return { success: true, data, error: null };
  } catch (err) {
    console.error("Apply Job Handler Error:", err);
    return { success: false, data: null, error: "Unexpected server error." };
  }
}

export async function insertResumeByUser({ p_file_url, p_seeker_id, p_summary, p_title }) {
  try {
    const { data, error } = await supabase.rpc("insert_resume_by_user_id", {
      p_file_url,
      p_seeker_id,
      p_summary,
      p_title
    });
    if (error) {
      console.error("Error inserting resume:", error);
      return { success: false, data: null, error: error.message || "Failed to insert resume" };
    }
    return { success: true, data, error: null };
  } catch (err) {
    console.error("Insert Resume Handler Error:", err);
    return { success: false, data: null, error: "Unexpected server error." };
  }
}

export async function updateApplicationToCancelled(p_application_id) {
  try {
    const { data, error } = await supabase.rpc("update_application_status_to_cancelled_by_application_id", {
      p_application_id
    });
    if (error) {
      console.error("Error cancelling application:", error);
      return { success: false, data: null, error: error.message || "Failed to cancel application" };
    }
    return { success: true, data, error: null };
  } catch (err) {
    console.error("Cancel Application Handler Error:", err);
    return { success: false, data: null, error: "Unexpected server error." };
  }
}

export async function countApplicationsByUser(p_seeker_id) {
  try {
    const { data, error } = await supabase.rpc("count_application_by_user_id", {
      p_seeker_id
    });
    if (error) {
      console.error("Error counting applications:", error);
      return { success: false, data: 0, error: error.message || "Failed to count applications" };
    }
    // RPC returns array with single object or number; normalize
    if (typeof data === "number") return { success: true, data, error: null };
    if (Array.isArray(data) && data[0]?.count_application_by_user_id !== undefined) {
      return { success: true, data: data[0].count_application_by_user_id || 0, error: null };
    }
    return { success: true, data: 0, error: null };
  } catch (err) {
    console.error("Count Applications Handler Error:", err);
    return { success: false, data: 0, error: "Unexpected server error." };
  }
}

export async function getAcceptedApplicationsByUser(p_seeker_id) {
  try {
    const { data, error } = await supabase.rpc("get_application_status_accepted_by_user_id", {
      p_seeker_id
    });
    if (error) {
      console.error("Error fetching accepted applications:", error);
      return { success: false, data: [], error: error.message || "Failed to fetch accepted applications" };
    }
    return { success: true, data: data || [], error: null };
  } catch (err) {
    console.error("Get Accepted Applications Handler Error:", err);
    return { success: false, data: [], error: "Unexpected server error." };
  }
}

export async function getAppliedApplicationsByUser(p_seeker_id) {
  try {
    const { data, error } = await supabase.rpc("get_application_status_applied_by_user_id", {
      p_seeker_id
    });
    if (error) {
      console.error("Error fetching applied applications:", error);
      return { success: false, data: [], error: error.message || "Failed to fetch applied applications" };
    }
    return { success: true, data: data || [], error: null };
  } catch (err) {
    console.error("Get Applied Applications Handler Error:", err);
    return { success: false, data: [], error: "Unexpected server error." };
  }
}

// Fetch resume by user id
export async function getResumeByUser(p_user_id) {
  try {
    const { data, error } = await supabase.rpc('get_resume_by_user_id', { p_user_id });
    if (error) {
      console.error('Error fetching resume by user:', error);
      return { success: false, data: [], error: error.message || 'Failed to fetch resume' };
    }
    return { success: true, data: data || [], error: null };
  } catch (err) {
    console.error('Get Resume By User Handler Error:', err);
    return { success: false, data: [], error: 'Unexpected server error.' };
  }
}
