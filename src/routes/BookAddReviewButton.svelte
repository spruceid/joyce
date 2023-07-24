<script lang="ts">
  import { showAlert } from '$lib/stores/alert.store';
  import { profile, type ProfileData } from '$lib/stores/auth.store';
  import { reviews, type GoogleBookItem, type Reviews } from '$lib/stores/book.store';
  import { issue } from '$lib/stores/credentials.store';
  import { getUsersData } from '$lib/stores/users.store';
  import { toCredentialEntry } from '$lib/utils/rebase';
  import BookRating from './BookRating.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let book: GoogleBookItem;

  const getUserReviewsData = () => {
    if (_reviews[book.id]) {
      const userHandles = _reviews[book.id]?.map(
        (review) => toCredentialEntry(review).content.subject.split(':').pop() ?? ''
      );
      getUsersData(userHandles);
    }
  };

  let _reviews: Reviews = {};
  $: _reviews, getUserReviewsData();
  reviews.subscribe((x) => (_reviews = x));

  let _profile: ProfileData | null = null;
  profile.subscribe((x) => (_profile = x));

  $: open = false;
  $: rating = 5;
  $: reviewTitleValue = '';
  $: reviewContentValue = '';

  const openModal = () => {
    open = true;
  };

  const closeModal = () => {
    open = false;
  };

  const addReview = async () => {
    if (!reviewContentValue || !reviewTitleValue) {
      showAlert.set({
        variant: 'error',
        message: 'Fill the review fields'
      });
      return;
    }

    try {
      await issue('BookReviewAttestation', {
        link: `https://www.googleapis.com/books/v1/volumes/${book.id}`,
        rating,
        review: reviewContentValue,
        title: reviewTitleValue
      });

      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          address: _profile?.address,
          google_book_id: book.id,
          rating
        })
      }).then((res) => res.json());

      dispatch('credentialCreated', { rating });

      reviewTitleValue = '';
      reviewContentValue = '';
      rating = 5;

      closeModal();
    } catch (e) {
      showAlert.set({
        variant: 'error',
        message: e as string
      });
    }
  };
</script>

<button class="px-3 py-2 rounded-md text-sm font-medium bg-blue-1 text-white" on:click={openModal}>
  <slot />
</button>
<div
  class:hidden={!open}
  class="relative z-10"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
>
  <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
      <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
      >
        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white" id="modal-title">
                {book.title}
              </h3>
              <p class="text-sm font-light text-gray-800 dark:text-white mt-2">
                {book.authors ? 'By ' : ''}{book.authors?.join(', ') ?? ''}
                {book.authors && book.publishedDate ? '·' : ''}
                {book.publishedDate?.split('-')[0] ?? ''}
              </p>
            </div>
          </div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 border-t border-t-gray-200 dark:border-t-gray-600 px-4 py-3 sm:px-6"
        >
          <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-2">Write Review</h3>
          <div class="flex wrap justify-between">
            <div class="w-fill-available">
              <span class="block mb-5 text-sm font-medium text-gray-900 dark:text-white">
                Rating
              </span>
              <BookRating
                {rating}
                onChange={(newRating) => (rating = newRating)}
                takeaway={rating.toFixed(1).toString()}
              />
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 px-4 py-3 sm:px-6">
          <span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Title Review
          </span>
          <input
            id="review-title"
            bind:value={reviewTitleValue}
            class="block p-2.5 mb-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write here..."
          />
          <span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Write A Review
          </span>
          <textarea
            id="review-content"
            bind:value={reviewContentValue}
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write here..."
          />
        </div>
        <div
          class="bg-white dark:bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 sm:justify-center"
        >
          <button
            on:click={addReview}
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-blue-1 px-3 py-2 text-sm font-semibold min-w-[150px] text-gray-900 shadow-sm sm:mt-0 sm:ml-3 sm:w-auto"
          >
            SAVE
          </button>
          <button
            on:click={closeModal}
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-transparent border border-red-600 text-red-600 px-3 py-2 text-sm font-semibold min-w-[150px] shadow-sm hover:bg-red-600 hover:text-white sm:w-auto"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
