<script lang='ts'>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	if (browser) {
		let redirectTo: string;
		const query = $page.url.search;
		const encodedParamURL = $page.params.id;
		if (query) {
			redirectTo = `/output${query}#${encodedParamURL}`
		} else {
			redirectTo = `/output#${encodedParamURL}`
		}
		goto(redirectTo);
	}
</script>
