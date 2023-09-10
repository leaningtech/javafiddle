import { drizzle } from 'drizzle-orm/postgres-js';
import { DATABASE_URL } from '$env/static/private';
import postgres from 'postgres';
import * as schema from "./schema";
 
const queryClient = postgres(DATABASE_URL);
const db = drizzle(queryClient, { schema });

export default db;
