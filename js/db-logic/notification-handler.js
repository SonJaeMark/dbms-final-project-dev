// notification-handler.js
import { supabase } from "../core/supabase-client.js";

/**
 * Inserts a new notification
 * @param {string} p_user_id - User ID
 * @param {string} p_type - Notification type
 * @param {Object} p_data - Notification data object
 * @returns {Object} { success, data, error }
 */
export async function insertNotification(p_user_id, p_type, p_data) {
  try {
    const { data, error } = await supabase.rpc('insert_notification', {
      p_data,
      p_type,
      p_user_id
    });

    if (error) {
      console.error("Error inserting notification:", error);
      return {
        success: false,
        data: null,
        error: error.message || error.details || "Failed to insert notification"
      };
    }

    return {
      success: true,
      data: data,
      error: null
    };
  } catch (err) {
    console.error("Insert Notification Handler Error:", err);
    return {
      success: false,
      data: null,
      error: "Unexpected server error."
    };
  }
}

/**
 * Updates a notification to read
 * @param {string} p_notif_id - Notification ID
 * @param {string} p_user_id - User ID
 * @returns {Object} { success, data, error }
 */
export async function updateNotificationToRead(p_notif_id, p_user_id) {
  try {
    const { data, error } = await supabase.rpc('update_notification_to_read', {
      p_notif_id,
      p_user_id
    });

    if (error) {
      console.error("Error updating notification:", error);
      return {
        success: false,
        data: null,
        error: error.message || error.details || "Failed to update notification"
      };
    }

    return {
      success: true,
      data: data,
      error: null
    };
  } catch (err) {
    console.error("Update Notification Handler Error:", err);
    return {
      success: false,
      data: null,
      error: "Unexpected server error."
    };
  }
}

/**
 * Gets all unread notifications for a user
 * @param {string} p_user_id - User ID
 * @returns {Object} { success, data, error }
 */
export async function getAllUnreadNotifications(p_user_id) {
  try {
    const { data, error } = await supabase.rpc('get_all_unread_notification', {
      p_user_id
    });

    if (error) {
      console.error("Error fetching notifications:", error);
      return {
        success: false,
        data: null,
        error: error.message || error.details || "Failed to fetch notifications"
      };
    }

    return {
      success: true,
      data: data || [],
      error: null
    };
  } catch (err) {
    console.error("Get Notifications Handler Error:", err);
    return {
      success: false,
      data: null,
      error: "Unexpected server error."
    };
  }
}

