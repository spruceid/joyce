import { _profile } from '$lib/stores/auth.store.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  if (
    params.handle &&
    params.type &&
    (params.type === 'following' || params.type === 'followers')
  ) {
    if (_profile) {
      return {
        user: _profile,
        handle: params.handle,
        type: params.type
      };
    }
    return {
      user: {
        address: 'slimshaddy',
        ens: {
          domain: 'Mr. CheeseBurguer'
        }
      },
      handle: params.handle,
      type: params.type
    };
  }

  throw error(404, 'Not found');
}
