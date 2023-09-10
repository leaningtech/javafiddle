import db from "./conn.server";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUserByGithubId(githubId: number) {
	const rows = await db.select()
		.from(users)
		.where(eq(users.githubId, githubId))
		.limit(1);
	if (rows.length) {
		return rows[0];
	}

	await db.insert(users).values({
		githubId,
	});
	return getOrCreateUserByGithubId(githubId);
}
