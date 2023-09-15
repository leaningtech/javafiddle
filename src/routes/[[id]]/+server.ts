import { z } from 'zod';
import db from '$lib/db/conn.server.js';
import { fiddleFiles, fiddles } from '$lib/db/schema.js';
import { error, json } from '@sveltejs/kit';
import { sql, and, eq, notInArray } from 'drizzle-orm';
import { ytid } from "ytid";

const data = z.object({
	files: z.array(z.object({
		id: z.number().optional(),
		path: z.string(),
		content: z.string(),
	})),
});

export async function POST({ request, params, locals }) {
	const { userId } = locals.session.data;
	if (typeof userId !== "number") throw error(401);

	const { files } = data.parse(await request.json());

	let fiddleId: string;
	if (params.id) {
		fiddleId = params.id;

		// make sure it exists, user has permission to modify, and increase updated
		const rows = await db.update(fiddles)
			.set({
				updated: sql`CURRENT_TIMESTAMP`,
			})
			.where(
				and(
					eq(fiddles.id, fiddleId),
					eq(fiddles.userId, userId),
				)
			)
			.returning({ updatedId: fiddles.id });
		if (rows.length === 0) throw error(403);
	} else {
		// create new fiddle 
		fiddleId = ytid();
		await db.insert(fiddles).values({
			id: fiddleId,
			userId,
			title: "",
			description: "",
		});
	}

	await db.transaction(async tx => {
		// delete removed files
		const fileIds = files.map(f => f.id).filter(Boolean) as number[];
		if (fileIds.length) {
			await tx.delete(fiddleFiles).where(
				and(
					notInArray(fiddleFiles.id, fileIds),
					eq(fiddleFiles.fiddleId, fiddleId),
				)
			);
		} else {
			await tx.delete(fiddleFiles).where(eq(fiddleFiles.fiddleId, fiddleId));
		}

		// upsert existing files
		for (const { id, path, content } of files) {
			if (id) {
				await tx.update(fiddleFiles).set({
					path,
					content,
				}).where(
					and(
						eq(fiddleFiles.id, id),
						eq(fiddleFiles.fiddleId, fiddleId),
					)
				);
			} else {
				await tx.insert(fiddleFiles).values({
					fiddleId,
					path,
					content,
				});
			}
		}
	});

	return json({
		fiddleId,
	});
}
