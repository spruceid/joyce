<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let queryParams = '';
  let searchResults = [];

  const fetchBooks = async () => {
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        queryParams
      )}&maxResults=40`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        searchResults = data.items || [];
      } else {
        throw new Error('Error while fetching books.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const search = (e) => {
    if (`${queryParams}`.length > 1) {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent the form submission
        fetchBooks();
        goto(`/search?query=${queryParams}`, { replaceState: true });
        return;
      } else if (e.type === 'click') {
        fetchBooks();
        goto(`/search?query=${queryParams}`);
      }
    }
  };
</script>

<div class="ml-auto relative">
  <label for="bookQuery" class="sr-only">Search</label>

  <form on:submit|preventDefault={search}>
    <input
      type="text"
      id="bookQuery"
      placeholder="Search..."
      bind:value={queryParams}
      on:keypress={search}
      class="rounded-md border-gray-200 bg-gray-200 py-2.5 pe-10 px-4 shadow-sm sm:text-sm text-gray-900 dark:bg-gray-900 dark:text-white"
    />

    <span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
      <button type="submit" class="rounded-full" on:click={search}>
        <span class="sr-only">Submit</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.646 22.4819L20.7778 17.6138C20.5581 17.394 20.2603 17.272 19.9478 17.272H19.1519C20.4995 15.5483 21.3003 13.3804 21.3003 11.022C21.3003 5.41162 16.7544 0.865723 11.144 0.865723C5.53369 0.865723 0.987793 5.41162 0.987793 11.022C0.987793 16.6323 5.53369 21.1782 11.144 21.1782C13.5024 21.1782 15.6704 20.3774 17.394 19.0298V19.8257C17.394 20.1382 17.5161 20.436 17.7358 20.6558L22.604 25.5239C23.063 25.9829 23.8052 25.9829 24.2593 25.5239L25.6411 24.1421C26.1001 23.6831 26.1001 22.9409 25.646 22.4819ZM11.144 17.272C7.69189 17.272 4.89404 14.479 4.89404 11.022C4.89404 7.56982 7.68701 4.77197 11.144 4.77197C14.5962 4.77197 17.394 7.56494 17.394 11.022C17.394 14.4741 14.6011 17.272 11.144 17.272Z"
            fill="grey"
          />
        </svg>
      </button>
    </span>
  </form>
</div>
