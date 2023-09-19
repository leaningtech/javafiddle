import { handleSession } from 'svelte-kit-cookie-session';
import { COOKIE_SECRET } from "$env/static/private";
import { migrateDb } from '$lib/db/conn.server';
import { migrate } from "drizzle-orm/postgres-js/migrator";

if (COOKIE_SECRET === "INSECURE_CHANGE_ME_32_CHARS_ONLY") {
	console.warn("insecure cookie secret");
	if (process.env.NODE_ENV === "production") throw new Error("refusuing to use insecure cookie secret in production");
}

await migrate(migrateDb, { migrationsFolder: "drizzle" });

export const handle = handleSession({
	secret: COOKIE_SECRET,
	expires: 30,
	expires_in: "days",
});
