import { writable } from "svelte/store";

export type File = {
	path: string,
	contents: string,
};

export const files = writable<File[]>([
	{
		path: "Main.java",
		contents: `package fiddle;

class Main {
    public static void main(String[] args) {
        new HelloSayer();
    }
}
`,
	},
	{
		path: "HelloSayer.java",
		contents: `package fiddle;

class HelloSayer {
    public HelloSayer() {
        System.out.println("Hello, World!"); 
    }
}
`,
	},
]);

// Persist files to CheerpJ filesystem
files.subscribe($files => {
	if ("cheerpjAddStringFile" in globalThis) {
		try {
			for (const file of $files) {
				cheerpjAddStringFile("/str/" + file.path, file.contents);
			}
			console.info("wrote files");
		} catch (error) {
			console.error("Error writing files to CheerpJ", error);
		}
	}
});

export const selectedFilePath = writable<string>("Main.java");
