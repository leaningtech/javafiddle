<script lang="ts">
	import spinnerGrey from '$lib/assets/loading-spinner.svg';
	import spinnerWhite from '$lib/assets/loading-spinner-white.svg';
	import { effectiveTheme } from './settings/store';

	$: spinner = $effectiveTheme === 'dark' ? spinnerWhite : spinnerGrey;
</script>

<div class="w-full h-full flex items-center justify-center">
	<img src={spinner} class="w-10 h-10" alt="Loading" />
</div>
