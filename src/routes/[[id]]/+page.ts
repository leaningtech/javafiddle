export function load({ url }) {
	let outputUrl = url.pathname;
	if (!outputUrl.endsWith('/')) outputUrl += '/';
	outputUrl += 'output';
	return {
		outputUrl
	};
}
