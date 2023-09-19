export async function load({ locals }) {
	await locals.session.destroy();
	return {};
}
