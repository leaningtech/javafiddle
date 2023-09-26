import { decompress } from '$lib/compress-fiddle.js';

export async function load({ params: { id } }) {
	if (!id) {
		return {
			fiddle: {
				title: "",
				updated: new Date,
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
				],
			},
		};
	}

	const fiddle = decompress(id); // TODO: error page

	return {
		fiddle,
	};
}
