import { writable } from "svelte/store";

export type File = {
	id?: number,
	path: string,
	content: string,
};

export const files = writable<File[]>([]);

// Persist files to CheerpJ filesystem
files.subscribe($files => {
	if ("cheerpjAddStringFile" in globalThis) {
		try {
			for (const file of $files) {
				cheerpjAddStringFile("/str/" + file.path, file.content);
			}
			console.info("wrote files");
		} catch (error) {
			console.error("Error writing files to CheerpJ", error);
		}
	}
});

export const selectedFilePath = writable<string>("Main.java");
