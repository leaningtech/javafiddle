<script type="ts">
	import { PUBLIC_GITHUB_CLIENT_ID } from "$env/static/public";
	import { page } from "$app/stores";

	const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${PUBLIC_GITHUB_CLIENT_ID}`;

	$: isLoggedIn = typeof $page.data.session.userId === "number";
</script>

{#if isLoggedIn}
	<a href="/auth/logout">
		Sign out
	</a>
{:else}
	<a href={githubLoginUrl}>
		Sign in
	</a>
{/if}
