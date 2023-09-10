export function load({ locals }) {
	return {
		session: locals.session.data
	};
}
