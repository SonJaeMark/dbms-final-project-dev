import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabaseUrl = "https://xdhacqxrqkfakmmkxwrp.supabase.co";
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkaGFjcXhycWtmYWttbWt4d3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0Nzc5MDUsImV4cCI6MjA4MDA1MzkwNX0.8E2i4kfXl0w0hXRI9YIMglbnv_Be9w44WBTuxabHLwM"; // safe for client-side

export const supabase = createClient(supabaseUrl, supabaseKey);
