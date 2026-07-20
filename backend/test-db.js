import "dotenv/config";
import pg from "pg";

const { Client } = pg;

console.log(process.version);
console.log(process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

try {
  await client.connect();
  console.log("✅ Connected");
  const res = await client.query("select now()");
  console.log(res.rows);
} catch (e) {
  console.error(e);
} finally {
  await client.end();
}