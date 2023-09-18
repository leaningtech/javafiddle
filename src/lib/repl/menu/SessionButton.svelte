<script type="ts">
	import { PUBLIC_GITHUB_CLIENT_ID } from "$env/static/public";
	import { page } from "$app/stores";

	const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${PUBLIC_GITHUB_CLIENT_ID}`;

	$: isLoggedIn = typeof $page.data.session.userId === "number";
</script>

{#if isLoggedIn}
	<a href="/auth/logout" class="text-xs hover:underline text-gray-500 dark:text-gray-400">
		Sign out
	</a>
{:else}
	<a href={githubLoginUrl} class="text-sm rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-3 py-2">
		Sign in to save
	</a>
{/if}
