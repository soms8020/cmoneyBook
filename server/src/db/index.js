import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const sql = neon(process.env.POSTGRES_URL);
export const db = drizzle(sql, { schema });
