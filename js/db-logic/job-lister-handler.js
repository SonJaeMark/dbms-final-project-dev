// job-lister-handler.js
import { supabase } from "../core/supabase-client.js";

/**
 * Creates a new job with images
 * @param {Object} jobData - Job data object
 * @returns {Object} { success, message, job_id, error }
 */
export async function addJobWithImages(jobData) {
  try {
    const {
      p_category,
      p_description,
      p_images,
      p_lister_id,
      p_location,
      p_rate_amount,
      p_rate_type,
      p_required_skills,
      p_salary_notes,
      p_status,
      p_title,
      p_vacancies_available,
      p_work_schedule,
      p_work_type
    } = jobData;

    console.log("Submitting job data:", {
      p_title,
      p_category,
      p_lister_id,
      p_images_count: p_images?.length || 0,
      p_status
    });

    const rpcParams = {
      p_category,
      p_description,
      p_images: p_images || [],
      p_lister_id,
      p_location,
      p_rate_amount,
      p_rate_type,
      p_required_skills,
      p_salary_notes,
      p_status: p_status || 'draft',
      p_title,
      p_vacancies_available,
      p_work_schedule,
      p_work_type
    };

    console.log("RPC Parameters:", rpcParams);

    const { data, error } = await supabase.rpc('add_job_with_images', rpcParams);

    if (error) {
      console.error("Error creating job:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return {
        success: false,
        message: error.message || error.details || "Failed to create job",
        job_id: null,
        error: error
      };
    }

    console.log("Job created successfully:", data);

    return {
      success: true,
      message: data?.message || "Job created successfully",
      job_id: data?.job_id || null
    };

  } catch (err) {
    console.error("Job Lister Handler Error:", err);
    return {
      success: false,
      message: "Unexpected server error.",
      job_id: null,
      error: err
    };
  }
}

/**
 * Gets job counts for a lister
 * @param {string} listerId - Lister user ID
 * @returns {Object} { drafted, published, applicants }
 */
export async function getJobCounts(listerId) {
  try {
    // This would need a separate RPC or query
    // For now, returning placeholder structure
    return {
      success: true,
      drafted: 0,
      published: 0,
      applicants: 0
    };
  } catch (err) {
    console.error("Error getting job counts:", err);
    return {
      success: false,
      drafted: 0,
      published: 0,
      applicants: 0
    };
  }
}

/**
 * Updates a job
 * @param {Object} jobData - Job data object
 * @returns {Object} { success, data, error }
 */
export async function updateJob(jobData) {
  try {
    const {
      p_category,
      p_description,
      p_job_id,
      p_location,
      p_rate_amount,
      p_rate_type,
      p_required_skills,
      p_salary_notes,
      p_status,
      p_title,
      p_vacancies_available,
      p_work_schedule,
      p_work_type
    } = jobData;

    const { data, error } = await supabase.rpc('update_job', {
      p_category,
      p_description,
      p_job_id,
      p_location,
      p_rate_amount,
      p_rate_type,
      p_required_skills,
      p_salary_notes,
      p_status,
      p_title,
      p_vacancies_available,
      p_work_schedule,
      p_work_type
    });

    if (error) {
      console.error("Error updating job:", error);
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
 * Updates a job image
 * @param {Object} imageData - Image data object
 * @returns {Object} { success, data, error }
 */
export async function updateJobImage(imageData) {
  try {
    const {
      p_caption,
      p_display_order,
      p_file_url,
      p_image_id,
      p_job_id
    } = imageData;

    const { data, error } = await supabase.rpc('update_job_image', {
      p_caption,
      p_display_order,
      p_file_url,
      p_image_id,
      p_job_id
    });

    if (error) {
      console.error("Error updating job image:", error);
      return {
        success: false,
        data: null,
        error: error.message || error.details || "Failed to update job image"
      };
    }

    return {
      success: true,
      data: data,
      error: null
    };
  } catch (err) {
    console.error("Update Job Image Handler Error:", err);
    return {
      success: false,
      data: null,
      error: "Unexpected server error."
    };
  }
}

/**
 * Deletes a job
 * @param {string} p_job_id - Job ID
 * @param {string} p_lister_id - Lister user ID
 * @returns {Object} { success, data, error }
 */
export async function deleteJobReturn(p_job_id, p_lister_id) {
  try {
    const { data, error } = await supabase.rpc('delete_job_return', {
      p_job_id,
      p_lister_id
    });

    if (error) {
      console.error("Error deleting job:", error);
      return {
        success: false,
        data: null,
        error: error.message || error.details || "Failed to delete job"
      };
    }

    return {
      success: true,
      data: data,
      error: null
    };
  } catch (err) {
    console.error("Delete Job Handler Error:", err);
    return {
      success: false,
      data: null,
      error: "Unexpected server error."
    };
  }
}

