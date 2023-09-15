import db from '$lib/db/conn.server.js';
import { fiddles, fiddleFiles } from '$lib/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ params: { id } }) {
	if (!id) {
		return {
			files: [
				{
					path: "Main.java",
					content: `package fiddle;

class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); 
    }
}
`,
				},
			]
		};
	}

	const rows = await db.select().from(fiddles).where(eq(fiddles.id, id));
	if (!rows.length) {
		console.warn("no fiddle with id", id);
		throw redirect(302, "/");
	}
	const fiddle = rows[0];

	const files = await db.select().from(fiddleFiles).where(eq(fiddleFiles.fiddleId, id));

	return {
		fiddle,
		files,
	};
}
