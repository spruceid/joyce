<script lang="ts">
  import { onMount } from 'svelte';
  import { books, type Books } from '$lib/stores/book.store';
  import HomePageBook from './HomePageBook.svelte';
  let _books: Books | null = null;
  books.subscribe((x) => (_books = x));

  let booksResponse: Array<any> = [];

  onMount(async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=spruce&maxResults=20&printType=books`
      );
      const data = await response.json();
      booksResponse = data.items
        .map(({ id, volumeInfo }) => ({ id, ...volumeInfo }))
        .filter((item) => item.imageLinks?.thumbnail);

      // Save data to use it if the user selects the book
      books.set({
        ..._books,
        ...booksResponse.reduce((acc, value) => ({ ...acc, [value.id]: value }), {})
      });
    } catch (error) {
      console.error(error);
    }
  });
</script>

<svelte:head>
  <title>Joyce</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

{#if booksResponse.length > 0}
  <div class="hidden md:block w-full">
    <div class="flex w-full">
      <div class="w-1/3 mt-16" />
      <div class="w-1/3">
        <h1 class="text-9xl font-bold text-center dark:text-white">Joyce</h1>
        <h2 class="text-5xl font-medium text-center mt-4 dark:text-white">
          Discover your next book!
        </h2>
      </div>
      <div class="w-1/3 mt-16" />
    </div>

    <div class="flex w-full mt-16">
      <div class="w-1/6" />
      <div class="w-2/3 flex justify-between">
        {#each booksResponse.slice(0, 3) as book}
          <HomePageBook id={book.id} title={book.title} thumbnail={book.imageLinks?.thumbnail} />
        {/each}
      </div>
      <div class="w-1/6" />
    </div>

    <div class="flex w-full mt-16">
      <div class="w-1/6" />
      <div class="w-2/3 flex justify-between">
        {#each booksResponse.slice(3, 6) as book}
          <HomePageBook id={book.id} title={book.title} thumbnail={book.imageLinks?.thumbnail} />
        {/each}
      </div>
      <div class="w-1/6" />
    </div>

    <div class="flex w-full mt-16">
      <div class="w-1/6" />
      <div class="w-2/3 flex justify-between">
        {#each booksResponse.slice(6, 9) as book}
          <HomePageBook id={book.id} title={book.title} thumbnail={book.imageLinks?.thumbnail} />
        {/each}
      </div>
      <div class="w-1/6" />
    </div>
  </div>

  <div class="block md:hidden w-full">
    <div class="flex flex-wrap w-full">
      <div class="w-full my-4">
        <h1 class="text-5xl font-bold text-center dark:text-white">Joyce</h1>
        <h2 class="text-3xl font-medium text-center mt-4 dark:text-white">
          Discover your next book!
        </h2>
      </div>
    </div>

    <div class="flex w-full mt-2">
      <div class="w-1/2 xs:w-1/3 flex justify-between">
        {#each booksResponse.slice(0, 1) as book}
          <HomePageBook id={book.id} title={book.title} thumbnail={book.imageLinks?.thumbnail} />
        {/each}
      </div>
      <div class="w-1/2 xs:w-1/3 mt-8">
        {#each booksResponse.slice(1, 2) as book}
          <HomePageBook id={book.id} title={book.title} thumbnail={book.imageLinks?.thumbnail} />
        {/each}
      </div>
      <div class="w-1/6" />
    </div>

    <div class="flex w-full mt-2">
      <div class="w-1/2 xs:w-1/3 flex justify-between">
        {#each booksResponse.slice(3, 4) as book}
          <HomePageBook id={book.id} title={book.title} thumbnail={book.imageLinks?.thumbnail} />
        {/each}
      </div>
      <div class="w-1/2 xs:w-1/3 mt-8">
        {#each booksResponse.slice(4, 5) as book}
          <HomePageBook id={book.id} title={book.title} thumbnail={book.imageLinks?.thumbnail} />
        {/each}
      </div>
      <div class="w-1/6" />
    </div>
  </div>
{/if}

<div id="sentinel" style="height: 1px;" />
