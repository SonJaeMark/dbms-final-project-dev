import { supabase } from "./supabase-client.js";

(async function runDML() {
  try {
    // Load SQL file containing your 50 INSERT statements
    const response = await fetch("../1_SQL_SCRIPTS/1.2_DML_TestData.sql");
    const sqlScript = await response.text();

    console.log("Loaded DML SQL, executing...");

    // Execute SQL using RPC
    const { data, error } = await supabase.rpc("exec_sql", {
      sql_script: sqlScript
    });

    if (error) {
      console.error("❌ SQL execution error:", error);
      return;
    }

    console.log("✅ DML inserted successfully:", data);

  } catch (err) {
    console.error("❌ JS runtime error:", err);
  }
})();
