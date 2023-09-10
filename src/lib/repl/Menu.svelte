<script type="ts">
	import { PUBLIC_GITHUB_CLIENT_ID } from "$env/static/public";

	const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${PUBLIC_GITHUB_CLIENT_ID}`;
</script>

<header class="px-4 flex items-center justify-between gap-4 bg-white text-black relative shadow">
	<h1>JavaFiddle</h1>

	<ul class="my-4 text-sm">
		<li>
			<button>
				New
			</button>
		</li>
	</ul>

	<ul class="flex-1 text-right">
		<li>
			<a href={githubLoginUrl}>Sign in</a>
		</li>
	</ul>
</header>
