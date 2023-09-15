<script>
	import "../app.css";
	import { effectiveTheme } from "$lib/settings/store";
</script>

<div class="contents" class:dark={$effectiveTheme === "dark"}>
	<div class="bg-white text-black dark:bg-gray-900 dark:text-white">
		<slot />
	</div>
</div>
