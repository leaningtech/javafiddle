import { drizzle } from 'drizzle-orm/postgres-js';
import { DATABASE_URL } from '$env/static/private';
import postgres from 'postgres';
import * as schema from "./schema";
 
const db = drizzle(postgres(DATABASE_URL), { schema });
export const migrateDb = drizzle(postgres(DATABASE_URL, { max: 1 })); 

export default db;
