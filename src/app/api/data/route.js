import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT current_database()");
  return Response.json(rows);
}
