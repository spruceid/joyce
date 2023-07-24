import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  if (params.handle) {
    return {
      userHandle: params.handle
    };
  }

  throw error(404, 'Not found');
}
