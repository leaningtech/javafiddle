<script lang='ts'>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	// to support legacy URLs like https://javafiddle.leaningtech.com/PARAM[/theme=dark|light]
	// the parameter is converted into fragment before the redirection
	if (browser) {
		let redirectTo: string;
		const query = $page.url.search;
		const encodedParamURL = $page.params.id;
		if (query) {
			redirectTo = `/${query}#${encodedParamURL}`
		} else {
			redirectTo = `/#${encodedParamURL}`
		}
		goto(redirectTo);
	}
</script>
