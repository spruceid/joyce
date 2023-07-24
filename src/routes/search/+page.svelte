<script lang="ts">
  import { page } from '$app/stores';
  import { loading } from '$lib/stores/app.store';
  import { books, type GoogleBookAPIResponse, type GoogleBookItem } from '$lib/stores/book.store';
  import { onMount, afterUpdate } from 'svelte';
  import BookRating from '../BookRating.svelte';

  let _books: GoogleBookItem[] = [];
  books.subscribe((x) => (_books = Object.values(x)));

  let _loading: boolean | null = null;
  loading.subscribe((x) => (_loading = x));

  const fetchBooks = async (queryParams: string) => {
    loading.set(true);
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        queryParams
      )}&maxResults=40`;
      const response = await fetch(url);
      if (response.ok) {
        const data: GoogleBookAPIResponse = await response.json();
        const booksResponse = data.items
          .map(({ id, volumeInfo }) => ({ id, ...volumeInfo }))
          .filter((item) => item.imageLinks?.thumbnail);

        // Save data to use it if the user selects the book
        books.set({
          ...booksResponse.reduce((acc, value) => ({ ...acc, [value.id]: value }), {})
        });
        loading.set(false);
      } else {
        throw new Error('Error while fetching books.');
      }
    } catch (error) {
      console.error(error);
      loading.set(false);
    }
    loading.set(false);
  };

  onMount(() => {
    const queryParams = $page.url.searchParams.get('query');
    if (!_loading && _books.length === 0 && queryParams) {
      fetchBooks(queryParams);
    }
  });

  let prevQueryParams = ''; // Track the previous query parameters

  afterUpdate(() => {
    const queryParams = $page.url.searchParams.get('query');
    if (queryParams !== prevQueryParams) {
      prevQueryParams = queryParams; // Update the previous query parameters
      fetchBooks(queryParams);
    }
  });
</script>

<div class="w-full max-w-3xl m-auto">
  {#if !_loading}
    <p class="text-4xl mb-2 dark:text-white">Search `{`${$page.url.searchParams.get('query')}`}`</p>
    <p class="dark:text-white">{`${_books.length} Books` || 'No results found'}</p>
    <div class="bg-white dark:bg-gray-200 rounded-lg px-9 py-5 mt-6">
      <p class="text-lg font-medium border-b-2 border-gray-200 dark:border-gray-300 pb-4">Books</p>
      {#each _books as book}
        <div
          class="flex flex-row border-b-2 py-4 px-1 items-center border-gray-200 dark:border-gray-300"
        >
          <a href={`/volumes/${book.id}`}>
            <img
              class="mr-6 rounded-xl min-w-[100px]"
              src={book.imageLinks?.thumbnail}
              alt={`${book.title} cover`}
            />
          </a>
          <div class="flex flex-col">
            <a class="text-lg mb-1" href={`/volumes/${book.id}`}>{book.title}</a>
            <p class="text-sm">
              {book.authors ? 'By ' : ''}{book.authors?.join(', ') ?? ''}
              {book.authors && book.publishedDate ? '·' : ''}
              {book.publishedDate?.split('-')[0] ?? ''}
            </p>
            <div class="flex items-center mt-2">
              <BookRating rating={4.95} takeaway="4.95 out of 229 Ratings" readOnly />
            </div>
            <!-- @TODO: Temporarily removing until there is a way to query more than 1 at a time -->
            <!-- <AddToMyListButton {book}/> -->
          </div>
        </div>
      {/each}
    </div>
  {:else}
    Loading...
  {/if}
</div>

<div class="w-full max-w-3xl m-auto">
  {#if !_loading}
    <p class="text-4xl mb-2 dark:text-white">Search `{`${$page.url.searchParams.get('query')}`}`</p>
    <p class="dark:text-white">{`${_books.length} Books` || 'No results found'}</p>
    <div class="bg-white dark:bg-gray-200 rounded-lg px-9 py-5 mt-6">
      <p class="text-lg font-medium border-b-2 border-gray-200 dark:border-gray-300 pb-4">Books</p>
      {#each _books as book}
        <div
          class="flex flex-row border-b-2 py-4 px-1 items-center border-gray-200 dark:border-gray-300"
        >
          <a href={`/volumes/${book.id}`}>
            <img
              class="mr-6 rounded-xl min-w-[100px]"
              src={book.imageLinks?.thumbnail}
              alt={`${book.title} cover`}
            />
          </a>
          <div class="flex flex-col">
            <a class="text-lg mb-1" href={`/volumes/${book.id}`}>{book.title}</a>
            <p class="text-sm">
              {book.authors ? 'By ' : ''}{book.authors?.join(', ') ?? ''}
              {book.authors && book.publishedDate ? '·' : ''}
              {book.publishedDate?.split('-')[0] ?? ''}
            </p>
            <div class="flex items-center mt-2">
              <BookRating rating={4.95} takeaway="4.95 out of 229 Ratings" readOnly />
            </div>
            <!-- @TODO: Temporarily removing until there is a way to query more than 1 at a time -->
            <!-- <AddToMyListButton {book}/> -->
          </div>
        </div>
      {/each}
    </div>
  {:else}{/if}
</div>
