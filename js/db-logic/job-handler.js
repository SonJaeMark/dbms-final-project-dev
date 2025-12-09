// job-handler.js
import { supabase } from "../core/supabase-client.js";

/**
 * Fetches published jobs with pagination
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @returns {Object} { success, data, error, pagination }
 */
export async function getPublishedJobs(page = 1, pageSize = 12) {
  try {
    console.log("Fetching jobs - Page:", page, "PageSize:", pageSize);
    
    const { data, error } = await supabase.rpc('get_published_jobs_paginated', {
      p_page: page,
      p_page_size: pageSize
    });

    if (error) {
      console.error("Error fetching jobs:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Provide more helpful error messages
      let errorMessage = "Failed to fetch jobs.";
      if (error.code === '42883' || error.message?.includes('function') || error.message?.includes('does not exist')) {
        errorMessage = "The RPC function 'get_published_jobs_paginated' may not exist. Please ensure it's created in your database.";
      } else if (error.code === '42702' || error.message?.includes('ambiguous')) {
        errorMessage = "Database SQL Error: Column reference is ambiguous. The 'status' column exists in multiple tables. Please update the SQL function to use table aliases (e.g., 'jobs.status' instead of 'status').";
      } else if (error.code === 'PGRST116' || error.message?.includes('permission')) {
        errorMessage = "Permission denied. Please check your database permissions.";
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.details) {
        errorMessage = error.details;
      }
      
      return {
        success: false,
        error: errorMessage,
        errorDetails: error,
        data: null,
        pagination: null
      };
    }
    
    console.log("Jobs fetched successfully:", data?.length || 0, "jobs");

    if (!data || data.length === 0) {
      return {
        success: true,
        data: [],
        pagination: {
          total_count: 0,
          total_pages: 0,
          current_page: page,
          page_size: pageSize
        }
      };
    }

    // Extract pagination info from first item (all items have same pagination data)
    const firstJob = data[0];
    const pagination = {
      total_count: firstJob.total_count || 0,
      total_pages: firstJob.total_pages || 0,
      current_page: page,
      page_size: pageSize
    };

    // Remove pagination fields from job objects
    const jobs = data.map(job => {
      const { total_count, total_pages, ...jobData } = job;
      return jobData;
    });

    return {
      success: true,
      data: jobs,
      pagination
    };

  } catch (err) {
    console.error("Job Handler Error:", err);
    return {
      success: false,
      error: "Unexpected server error.",
      data: null,
      pagination: null
    };
  }
}

/**
 * Formats salary from rate_amount and rate_type
 * @param {number} rateAmount 
 * @param {string} rateType - 'monthly', 'daily', 'hourly', etc.
 * @param {string} salaryNotes - Optional notes
 * @returns {string} Formatted salary string
 */
export function formatSalary(rateAmount, rateType, salaryNotes = '') {
  if (!rateAmount) return "Not specified";
  
  const formattedAmount = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0
  }).format(rateAmount);

  let salary = `${formattedAmount}/${rateType}`;
  
  if (salaryNotes) {
    salary += ` (${salaryNotes})`;
  }
  
  return salary;
}

/**
 * Gets the first image URL from job images array
 * @param {Array} images - Array of image objects
 * @returns {string} Image URL or placeholder
 */
export function getJobImage(images) {
  if (!images || images.length === 0) {
    return "https://via.placeholder.com/340x180?text=No+Image";
  }
  
  // Sort by display_order and get first image
  const sortedImages = [...images].sort((a, b) => 
    (a.display_order || 0) - (b.display_order || 0)
  );
  
  return sortedImages[0].file_url || "https://via.placeholder.com/340x180?text=No+Image";
}

// Fetch single job with joined images by job id
export async function getJobWithImagesByJobId(p_job_id) {
  try {
    const { data, error } = await supabase.rpc('get_job_join_job_image_by_job_id', { p_job_id });
    if (error) {
      console.error('Error fetching job with images:', error);
      return { success: false, data: null, error: error.message || 'Failed to fetch job' };
    }

    if (!data || data.length === 0) {
      return { success: true, data: null, error: null };
    }

    // Aggregate rows into a single job object with images array
    const base = data[0];
    const job = {
      id: base.job_id,
      lister_id: base.lister_id,
      title: base.title,
      description: base.description,
      category: base.category,
      work_type: base.work_type,
      location: base.location,
      work_schedule: base.work_schedule,
      rate_amount: base.rate_amount,
      rate_type: base.rate_type,
      salary_notes: base.salary_notes,
      vacancies_available: base.vacancies_available,
      required_skills: base.required_skills,
      status: base.status,
      created_at: base.job_created_at,
      updated_at: base.job_updated_at,
      images: []
    };

    const images = [];
    for (const row of data) {
      if (row.image_id) {
        images.push({
          id: row.image_id,
          file_url: row.file_url,
          caption: row.caption,
          display_order: row.display_order,
          created_at: row.image_created_at
        });
      }
    }
    job.images = images;

    return { success: true, data: job, error: null };
  } catch (err) {
    console.error('Get Job With Images Handler Error:', err);
    return { success: false, data: null, error: 'Unexpected server error.' };
  }
}

// Filter jobs by optional parameters, defaulting missing values to null
export async function getJobsByFilter({
  p_category = null,
  p_limit = null,
  p_location = null,
  p_max_salary = null,
  p_min_salary = null,
  p_offset = null,
  p_title = null,
  p_work_type = null
} = {}) {
  try {
    const { data, error } = await supabase.rpc('get_job_by_filter', {
      p_category: p_category ?? null,
      p_limit: p_limit ?? null,
      p_location: p_location ?? null,
      p_max_salary: p_max_salary ?? null,
      p_min_salary: p_min_salary ?? null,
      p_offset: p_offset ?? null,
      p_title: p_title ?? null,
      p_work_type: p_work_type ?? null
    });
    if (error) {
      console.error('Error filtering jobs:', error);
      return { success: false, data: [], error: error.message || 'Failed to filter jobs' };
    }
    return { success: true, data: data || [], error: null };
  } catch (err) {
    console.error('Get Jobs By Filter Handler Error:', err);
    return { success: false, data: [], error: 'Unexpected server error.' };
  }
}
