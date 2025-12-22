const pool = require("./src/lib/db");

async function test() {
  const res = await pool.query("SELECT NOW()");
  console.log("✅ Connected:", res.rows[0]);
  process.exit(0);
}

test();
