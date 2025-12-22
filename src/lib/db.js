const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://avnadmin:8QJdwAjI102U4gSrbxhe@postgresql-1676600c-ob39b2c3c.database.cloud.ovh.net:20184/defaultdb?sslmode=require"
});

module.exports = pool;
