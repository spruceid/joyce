import { _books, books, type GoogleBookItemAPIResponse } from '$lib/stores/book.store.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  if (params.id) {
    if (!_books?.[params.id]) {
      return await fetch(`https://www.googleapis.com/books/v1/volumes/${params.id}`)
        .then((response) => response.json())
        .then((response: GoogleBookItemAPIResponse) => {
          books.set({
            ..._books,
            [response.id]: {
              ...response.volumeInfo,
              id: response.id
            }
          });
          return { ...response.volumeInfo, id: response.id };
        })
        .catch(console.error);
    }
    return _books?.[params.id];
  }

  throw error(404, 'Not found');
}
