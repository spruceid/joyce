<script lang="ts">
  import {
    profile,
    type LoadingProfile,
    type ProfileData,
    loadingProfile
  } from '$lib/stores/auth.store';
  import { Transition } from '@rgossiaux/svelte-headlessui';
  import OutsideAlerter from './OutsideAlerter.svelte';
  import { myList, type GoogleBookItem, type MyList } from '$lib/stores/book.store';
  import { issue } from '$lib/stores/credentials.store';
  import { toCredentialEntry, type ProgressBookLink } from '$lib/utils/rebase';
  import { showAlert } from '$lib/stores/alert.store';

  export let book: GoogleBookItem;

  $: addedToMyList = '';
  let showProfileDropdown = false;

  const toggleShow = () => (showProfileDropdown = !showProfileDropdown);

  let _myList: MyList = {};
  $: _myList, verifyAddedToMyList();
  myList.subscribe((x) => (_myList = x));

  let _profile: ProfileData | null = null;
  profile.subscribe((x) => (_profile = x));

  let _loadingProfile: LoadingProfile = false;
  loadingProfile.subscribe((x) => (_loadingProfile = x));

  const addToMyList = async (category: string) => {
    let progress;
    switch (category) {
      case 'WANT_READ':
        progress = 0;
        break;
      case 'IN_PROGRESS':
        progress = 1;
        break;
      case 'READ':
        progress = book.pageCount;
        break;
      case 'REMOVE':
        progress = -1;
        break;
    }
    try {
      await issue('ProgressBookLinkAttestation', {
        link: `https://www.googleapis.com/books/v1/volumes/${book.id}`,
        progress
      });
      toggleShow();
    } catch (e) {
      showAlert.set({
        variant: 'error',
        message: e as string
      });
    }
  };

  const verifyAddedToMyList = () => {
    if (_myList[book.id]) {
      const progress = (toCredentialEntry(_myList[book.id]).content as ProgressBookLink).progress;
      switch (true) {
        case progress === 0:
          addedToMyList = 'WANT_READ';
          break;
        case progress > 0 && progress < (book.pageCount ?? 0):
          addedToMyList = 'IN_PROGRESS';
          break;
        case progress === book.pageCount:
          addedToMyList = 'READ';
          break;
        default:
          addedToMyList = '';
      }
    }
  };
</script>

<!-- Profile dropdown -->
<OutsideAlerter
  onAlert={() => {
    if (showProfileDropdown) {
      toggleShow();
    }
  }}
>
  <div class="relative">
    {#if _profile}
      {#if addedToMyList}
        <button
          on:click={toggleShow}
          type="button"
          class="rounded bg-green-600 text-white text-xs px-2 py-2 w-full max-w-[200px] text-center mt-2"
          aria-expanded="false"
          aria-haspopup="true"
        >
          IN MY LIST
        </button>
      {:else}
        <button
          on:click={toggleShow}
          type="button"
          class="rounded bg-blue-600 text-white text-xs px-2 py-2 w-full max-w-[200px] text-center mt-2"
          aria-expanded="false"
          aria-haspopup="true"
        >
          + ADD TO LIST
        </button>
      {/if}
    {/if}

    <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  -->
    <Transition
      show={showProfileDropdown}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div
        class="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
      >
        <!-- Active: "bg-gray-100", Not Active: "" -->
        <button
          on:click|preventDefault={_loadingProfile ? null : () => addToMyList('WANT_READ')}
          class="block px-4 py-2 text-sm dark:text-gray-200"
          role="menuitem"
          tabindex="-1"
          class:text-gray-700={addedToMyList !== 'WANT_READ'}
          class:text-gray-200={addedToMyList === 'WANT_READ'}
          class:dark:text-gray-600={addedToMyList === 'WANT_READ'}
          disabled={addedToMyList === 'WANT_READ'}
        >
          Want to Read
        </button>

        <button
          on:click|preventDefault={_loadingProfile ? null : () => addToMyList('IN_PROGRESS')}
          class="block px-4 py-2 text-sm dark:text-gray-200"
          role="menuitem"
          tabindex="-1"
          class:text-gray-700={addedToMyList !== 'IN_PROGRESS'}
          class:text-gray-200={addedToMyList === 'IN_PROGRESS'}
          class:dark:text-gray-600={addedToMyList === 'IN_PROGRESS'}
          disabled={addedToMyList === 'IN_PROGRESS'}
        >
          In Progress
        </button>

        <button
          on:click|preventDefault={_loadingProfile ? null : () => addToMyList('READ')}
          class="block px-4 py-2 text-sm dark:text-gray-200"
          role="menuitem"
          tabindex="-1"
          class:text-gray-700={addedToMyList !== 'READ'}
          class:text-gray-200={addedToMyList === 'READ'}
          class:dark:text-gray-600={addedToMyList === 'READ'}
          disabled={addedToMyList === 'READ'}
        >
          Read
        </button>

        {#if addedToMyList}
          <button
            on:click|preventDefault={_loadingProfile ? null : () => addToMyList('REMOVE')}
            class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
            role="menuitem"
            tabindex="-1"
          >
            Remove
          </button>
        {/if}
      </div>
    </Transition>
  </div>
</OutsideAlerter>
