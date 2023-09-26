import { decompress, type Fiddle } from '$lib/compress-fiddle.js';

export async function load({ params: { id } }): Promise<{ fiddle: Fiddle, isDefault: boolean }> {
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
			isDefault: true,
		};
	}

	const fiddle = decompress(id); // TODO: error page

	return {
		fiddle,
		isDefault: false,
	};
}
