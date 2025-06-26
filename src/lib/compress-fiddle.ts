import lz from 'lz-string';
import z from 'zod';

const fiddle = z.object({
	files: z.array(
		z.object({
			path: z.string(),
			content: z.string()
		})
	),
	title: z.string(),
	updated: z.coerce.date().optional()
});

export type Fiddle = z.infer<typeof fiddle>;

export function compress(data: Fiddle): string {
	return lz.compressToEncodedURIComponent(JSON.stringify(data));
}

export function decompress(str: string): Fiddle {
	return fiddle.parse(JSON.parse(lz.decompressFromEncodedURIComponent(str)));
}

export const defaultFiddle: Fiddle = {
	title: '',
	files: [
		{
			path: 'Main.java',
			content: `package fiddle;

class Main {
	public static void main(String[] args) {
		System.out.println("Hello, World!");
	}
}
`
		}
	]
};

export const defaultFiddleComp = compress(defaultFiddle);
