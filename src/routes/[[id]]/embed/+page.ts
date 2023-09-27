export function load({ url }) {
	let outputUrl = url.pathname.replace("/embed", "");
	if (!outputUrl.endsWith("/")) outputUrl += "/";
	outputUrl += "output";
	return {
		outputUrl,
	}
}
