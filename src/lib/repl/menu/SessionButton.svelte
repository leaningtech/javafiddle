<script type="ts">
	import { PUBLIC_GITHUB_CLIENT_ID } from "$env/static/public";
	import { page } from "$app/stores";

	const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${PUBLIC_GITHUB_CLIENT_ID}`;

	$: isLoggedIn = typeof $page.data.session.userId === "number";
</script>

{#if isLoggedIn}
	<a href="/auth/logout" class="text-sm rounded bg-stone-100 hover:bg-stone-200 font-semibold px-3 py-2">
		Sign out
	</a>
{:else}
	<a href={githubLoginUrl} class="text-sm rounded bg-stone-100 hover:bg-stone-200 font-semibold px-3 py-2">
		Sign in
	</a>
{/if}
