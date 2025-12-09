import { supabase } from "./supabase-client.js";

(async function runDDL() {
  console.log("🔍 Starting DDL execution...");

  try {
    console.log("📄 Fetching SQL file...");

    const response = await fetch("../1_SQL_SCRIPTS/1.1_DDL_Schema.sql");

    if (!response.ok) {
      console.error("❌ Failed to load SQL file. HTTP Status:", response.status);
      throw new Error("SQL file fetch failed");
    }

    console.log("📥 SQL file fetched successfully!");

    const sqlScript = await response.text();
    console.log("📌 SQL Script length:", sqlScript.length, "characters");

    console.log("🚀 Sending SQL to Supabase exec_sql RPC...");
    const { data, error } = await supabase.rpc("exec_sql", {
      sql_script: sqlScript
    });

    if (error) {
      console.error("❌ Supabase RPC Error:");
      console.error("➡ Error Message:", error.message);
      console.error("➡ Error Details:", error.details);
      console.error("➡ Error Hint:", error.hint);
      console.error("➡ Full Error Object:", error);  
      return;
    }

    console.log("✅ SQL Executed Successfully!");
    console.log("📌 Returned Data:", data);

  } catch (err) {
    console.error("❌ Script Execution Failed!");
    console.error("➡ Error Name:", err.name);
    console.error("➡ Error Message:", err.message);
    console.error("➡ Full Error Object:", err);
  }

  console.log("🏁 DDL Script Finished");
})();
