<script lang="ts">
  import type { ProfileData } from '$lib/stores/auth.store';
  import { reviews, type GoogleBookItem } from '$lib/stores/book.store';
  import { users, type Users } from '$lib/stores/users.store';
  import { toCredentialEntry, type CredentialEntry } from '$lib/utils/rebase';
  import { createEventDispatcher } from 'svelte';
  import BookAddReviewButton from './BookAddReviewButton.svelte';
  import BookReview from './BookReview.svelte';

  export let _profile: ProfileData | null;
  const dispatch = createEventDispatcher();

  export let book: GoogleBookItem;

  let _reviews: Array<CredentialEntry> = [];
  reviews.subscribe((x) => (_reviews = x[book.id]?.map((r) => toCredentialEntry(r))));

  let _users: Users = {};
  users.subscribe((x) => {
    _users = x;
    if (_profile) {
      _users[_profile.address] = _profile;
    }
    return _users;
  });
</script>

{#if book && _profile}
  <div class="my-4 dark:text-gray-200">
    <div class="flex justify-between items-center">
      <p class="text-xl pb-4 font-bold">
        Reviews<br />
        <span class="text-sm font-normal"
          >{_reviews?.length ?? '0 - Write the first review for this book!'}</span
        >
      </p>
      <BookAddReviewButton {book} on:credentialCreated={(e) => dispatch('credentialCreated', e)}>
        CREATE REVIEW
      </BookAddReviewButton>
    </div>
    {#if _reviews}
      {#each _reviews as review}
        <BookReview
          {review}
          user={_users[review.content.subject.split(':').pop() ?? '']}
          class="py-2 border-t border-solid border-t-gray-300"
        />
      {/each}
    {/if}
  </div>
{:else}
  <p class="h2 text-3xl font-medium text-gray-800 dark:text-white">
    Connect your wallet to see reviews for this book.
  </p>
{/if}
