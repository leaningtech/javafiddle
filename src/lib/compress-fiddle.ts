import lz from "lz-string";
import z from "zod"

const fiddle = z.object({
	files: z.array(z.object({
		path: z.string(),
		content: z.string(),
	})),
	title: z.string(),
	updated: z.coerce.date(),
});

export type Fiddle = z.infer<typeof fiddle>;

export function compress(data: Fiddle): string {
	return lz.compressToEncodedURIComponent(JSON.stringify(data));
}

export function decompress(str: string): Fiddle {
	return fiddle.parse(JSON.parse(lz.decompressFromEncodedURIComponent(str)));
}
