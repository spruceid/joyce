<script lang="ts">
  import { profile, type ProfileData } from '$lib/stores/auth.store';
  import { reviews, type GoogleBookItem } from '$lib/stores/book.store';
  import { fetchBookFromMyList, fetchReviews } from '$lib/utils/book';
  import AddToMyListButton from './AddToMyListButton.svelte';
  import BookRating from './BookRating.svelte';
  import BookReviews from './BookReviews.svelte';

  export let book: GoogleBookItem;
  let _reviews;
  reviews.subscribe((r) => (_reviews = r));

  let _profile: ProfileData | null = null;
  profile.subscribe((x) => (_profile = x));
  $: _profile, fetchData();

  const fetchData = () => {
    fetchReviews(book.id).then((res) => {
      const { reviewers, score } = res;
      book.ratingsCount = reviewers.length;
      book.averageRating = score / (book.ratingsCount ?? 1);
    });
    fetchBookFromMyList(book.id);
  };
</script>

{#if book}
  <div class="block sm:flex my-4 align-start items-start">
    <div class="mb-4 sm:mb-0">
      <img class="m-auto" src={book.imageLinks?.thumbnail} alt={`${book.title} cover`} />
      <AddToMyListButton {book} />
    </div>
    <div class="ml-0 sm:ml-4 w-fill-available">
      <p class="text-3xl font-medium text-gray-800 dark:text-white">
        {book.title}{book?.subtitle ? ': ' + book?.subtitle : ''}
      </p>
      <p class="text-lg font-light text-gray-800 dark:text-white mt-2">
        {book.authors ? 'By ' : ''}{book.authors?.join(', ') ?? ''}
        {book.authors && book.publishedDate ? '·' : ''}
        {book.publishedDate?.split('-')[0] ?? ''}
      </p>

      <div class="flex items-center mt-2">
        {#if book.ratingsCount}
          <BookRating
            rating={book.averageRating}
            takeaway={`${book.averageRating} out of ${book.ratingsCount} Ratings`}
            readOnly
          />
        {:else}
          <p class="font-light text-gray-800 dark:text-white">No reviews for this book yet.</p>
        {/if}
      </div>

      <div class="my-4 dark:text-gray-200">
        {#if book.description}
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
            {@html book.description}
          </p>
        {/if}
        {#if book.categories}
          <p class="text-xl mt-2 font-bold">Genre(s)</p>
          <p class="mt-2 text-gray-700 dark:text-gray-400">
            {book.categories.join(', ')}
          </p>
        {/if}
        <p class="text-xl my-2 font-bold">Overview</p>
        {#if book.industryIdentifiers}
          <p class="text-gray-700 dark:text-gray-400">
            <span class="min-w-[100px] inline-block">ISBN:</span>
            {book.industryIdentifiers.map(({ identifier }) => identifier).join(', ')}
          </p>
        {/if}
        {#if book.publisher}
          <p class="text-gray-700 dark:text-gray-400">
            <span class="min-w-[100px] inline-block">Publisher:</span>
            {book.publisher}
          </p>
        {/if}
        {#if book.pageCount}
          <p class="text-gray-700 dark:text-gray-400">
            <span class="min-w-[100px] inline-block">Page count:</span>
            {book.pageCount}
          </p>
        {/if}
        {#if book.authors}
          <p class="text-gray-700 dark:text-gray-400">
            <span class="min-w-[100px] inline-block">Authors:</span>
            {book.authors.join(', ')}
          </p>
        {/if}
        {#if book.language}
          <p class="text-gray-700 dark:text-gray-400">
            <span class="min-w-[100px] inline-block">Language:</span>
            {book.language}
          </p>
        {/if}
      </div>
      <BookReviews {book} {_profile} on:credentialCreated={() => setTimeout(fetchData, 500)} />
    </div>
  </div>
{/if}
