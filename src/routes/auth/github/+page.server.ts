

import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_GITHUB_CLIENT_ID } from '$env/static/public';
import { GITHUB_CLIENT_SECRET } from '$env/static/private';
import z from "zod";
import { getOrCreateUserByGithubId } from "$lib/db/auth.server"

const githubUser = z.object({
	id: z.number(),
});

// get `code` from query string and validate it with github
export const load: PageServerLoad = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	if (!code) {
		throw redirect(303, "/");
	}

	const req = await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify({
			client_id: PUBLIC_GITHUB_CLIENT_ID,
			client_secret: GITHUB_CLIENT_SECRET,
			code,
		}),
	});
	const { access_token: accessToken } = await req.json();
	if (typeof accessToken !== "string") {
		throw error(401);
	}

	const userReq = await fetch("https://api.github.com/user", {
		headers: {
			"Authorization": `Bearer ${accessToken}`,
			"Accept": "application/json"
		},
	});
	const user = githubUser.parse(await userReq.json());

	const dbUser = await getOrCreateUserByGithubId(user.id);
	await locals.session.set({ userId: dbUser.id });

	// Can't redirect because we need to set cookie, so +page.svelte will do the redirect client-side
	return {};
};
