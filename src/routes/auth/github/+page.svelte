<script lang="ts">
	import { goto } from "$app/navigation";
	import Loading from "$lib/Loading.svelte";
	import { onMount } from "svelte";

	onMount(() => {
		if (window.opener) {
			postMessage({ action: "login" }, window.opener);
			window.close();
		} else {
			goto("/");
		}
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex">
</svelte:head>

<div class="w-screen h-screen">
	<Loading />
</div>
