import { browser } from "$app/environment";
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store"
import { writable, derived } from "svelte/store"

export type Theme = "system" | "light" | "dark";
export const theme = persist(writable<Theme>("system"), createLocalStorage(), "theme");

export const effectiveTheme = derived(theme, ($theme) => {
	if (browser) {
		const params = new URLSearchParams(document.location.search);
		if (params.has("theme")) {
			return params.get("theme");
		}
	}

	if ($theme === "system") {
		return (browser && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
	}
	return $theme;
});

export const autoRun = persist(writable<boolean>(true), createLocalStorage(), "autoRun");
