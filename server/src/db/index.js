import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const POSTGRES_URL = process.env.POSTGRES_URL || "postgresql://neondb_owner:npg_yedhitF6bs1w@ep-wandering-cell-aomvvmbh-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(POSTGRES_URL);
export const db = drizzle(sql, { schema });
