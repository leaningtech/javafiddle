import { writable } from 'svelte/store';
import {
	persist,
	createLocalStorage,
	createIndexedDBStorage
} from '@macfja/svelte-persistent-store';
import type { Fiddle } from '$lib/compress-fiddle';

export type File = {
	path: string;
	content: string;
};

export const files = writable<File[]>([]);

// Persist files to CheerpJ filesystem
files.subscribe(($files) => {
	if ('cheerpjAddStringFile' in globalThis) {
		try {
			const encoder = new TextEncoder();
			for (const file of $files) {
				cheerpjAddStringFile('/str/' + file.path, encoder.encode(file.content));
			}
			console.info('wrote files');
		} catch (error) {
			console.error('Error writing files to CheerpJ', error);
		}
	}
});

export const selectedFilePath = writable<string>('Main.java');

export const isSidebarOpen = persist(writable(true), createLocalStorage(), 'isSidebarOpen');

export const fiddleTitle = writable<string>('');
export const fiddleUpdated = writable<Date | undefined>();

export const favourites = persist(writable<Fiddle[]>([]), createIndexedDBStorage(), 'favourites');

// If loaded from favourites, this is the index of this fiddle in favourites
export const favouriteIndex = writable<number>(-1);
