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

export const selectedFilePath = writable<string>('Main.java');

export const isSidebarOpen = persist(writable(true), createLocalStorage(), 'isSidebarOpen');

export const fiddleTitle = writable<string>('');
export const fiddleUpdated = writable<Date | undefined>();

export const favourites = persist(writable<Fiddle[]>([]), createIndexedDBStorage(), 'favourites');

// If loaded from favourites, this is the index of this fiddle in favourites
export const favouriteIndex = writable<number>(-1);

export const description = writable<string>('JavaFiddle is an online, browser-based Java IDE. Create and share Swing applications for free!');

export const autoRun = persist(writable<boolean>(false), createLocalStorage(), 'autoRun');

export const isRunning = writable<boolean>(false);

export const isSaved = writable<boolean>(true);

export const runCode = writable<boolean>(false);

export const compileLog = writable<string>('');
