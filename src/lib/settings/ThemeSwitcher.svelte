<script lang="ts">
	import { theme, effectiveTheme } from "./store";
	import Icon from "@iconify/svelte";

	function toggle() {
		$theme = ($effectiveTheme === "dark" ? "light" : "dark");
	}
</script>

<button class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-400" on:click={toggle} aria-label="Toggle dark theme">
	<Icon icon={$effectiveTheme === "dark" ? "mi:moon" : "mi:sun"} class="w-5 h-5" />
</button>
