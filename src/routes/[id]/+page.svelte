<script lang='ts'>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	// to support legacy URLs like https://javafiddle.leaningtech.com/PARAM
	// the parameter is converted into fragment before the redirection
	export let data;
	const encodedParamURL = data.id;
	if (browser) {
		goto(`/#${encodedParamURL}`);
	}
</script>
