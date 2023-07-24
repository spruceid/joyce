<script lang="ts">
  import type { GoogleBookItem } from '$lib/stores/book.store';
  import { DEFAULT_USER_AVATAR, type UserData } from '$lib/stores/users.store';
  import type { CredentialEntry, BookReview } from '$lib/utils/rebase';
  import BookRating from './BookRating.svelte';

  let clazz: string = '';
  export { clazz as class };
  export let review: CredentialEntry;
  export let user: UserData;
  export let book: GoogleBookItem | null = null;

  const reviewContent = review.content as BookReview;
</script>

<div class={clazz}>
  <div class="flex wrap items-center">
    <img
      class="h-10 w-10 rounded-full mr-2"
      src={user?.avatar ?? DEFAULT_USER_AVATAR}
      alt={`user ${review.content.subject} avatar`}
    />
    <p>
      <b class="text-lg break-all">{user?.username}</b>
      <span class="text-xs text-gray-400 break-all">@{review.content.subject.split(':').pop()}</span
      >
      <br class="content-['123'] block text-[24%] -m-[2em]" />
      <span class="text-xs text-gray-400">
        {new Date(review.content.issuanceDate).toLocaleString('en-US')}
      </span>
    </p>
  </div>

  <div class="block sm:flex mt-2">
    {#if book && book.imageLinks?.thumbnail}
      <a href={`/volumes/${book.id}`} class="min-w-[130px] mr-2">
        <img class="rounded-md" src={book.imageLinks?.thumbnail} alt={`${book.id} cover`} />
      </a>
    {/if}
    <div>
      <BookRating
        class="my-2"
        rating={reviewContent.rating}
        takeaway={reviewContent.rating.toFixed(1).toString()}
        readOnly
      />
      <span class="text-bold">{reviewContent.title}</span><br />
      <span class="text-sm text-gray-500">{reviewContent.review}</span><br />
    </div>
  </div>
</div>
