import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,

  // OVH PostgreSQL SSL (required)
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },

  // VERY IMPORTANT FOR OVH
  max: 1,                    // ⬅️ MUST be 1
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,

  // ❌ REMOVE keepAlive completely
});

// DO NOT crash app on pool error
pool.on("error", (err) => {
  console.error("❌ PG Pool error:", err.message);
});

export default pool;
