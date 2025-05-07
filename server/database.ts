import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { questions, users, userPreferences } from '../shared/schema';
import Database from 'better-sqlite3';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';

// Create a database client
const databaseUrl = process.env.DATABASE_URL;

// Export tables for easy access
export const dbTables = {
  questions,
  users,
  userPreferences
};

// Create a drizzle database instance with appropriate driver based on environment
let db;
if (databaseUrl) {
  console.log('Using Neon Postgres database');
  const sql = neon(databaseUrl);
  db = drizzle(sql);
} else {
  console.log('Using SQLite in-memory database');
  const sqlite = new Database(':memory:');
  db = drizzleSQLite(sqlite);
}

export { db }; 