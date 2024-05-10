import type { Session } from 'svelte-kit-cookie-session';

type SessionData = {
	userId?: number;
};

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session<SessionData>;
		}
		interface PageData {
			// can add any properties here, return it from your root layout
			session: SessionData;
		}
		// interface Platform {}
	}

	interface Window {
		lwjglCanvasElement: HTMLCanvasElement;
	}
}

export {};
