<script lang="ts">
	import { theme, effectiveTheme } from "./store";
	import Icon from "@iconify/svelte";

	function toggle() {
		$theme = ($effectiveTheme === "dark" ? "light" : "dark");
	}
</script>

<button class="flex items-center gap-1  w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-500 rounded" on:click={toggle} aria-label="Toggle dark theme">
	<Icon icon={$effectiveTheme === "dark" ? "mi:moon" : "mi:sun"} class="w-5 h-5" />
	{$effectiveTheme === "dark" ? "Dark" : "Light"}
</button>
