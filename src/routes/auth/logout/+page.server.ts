export async function load({ locals }) {
	locals.session.destroy();
	return {};
}
