export function load({ url }) {
	let outputUrl = url.toString();
	if (!outputUrl.endsWith("/")) outputUrl += "/";
	outputUrl += "output";
	return {
		outputUrl,
	}
}
