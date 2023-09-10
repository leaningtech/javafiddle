<script type="ts">
	import SessionButton from "./menu/SessionButton.svelte";
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
			<SessionButton />
		</li>
	</ul>
</header>
