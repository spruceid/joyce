<script lang="ts">
  import {
    profile,
    type LoadingProfile,
    type ProfileData,
    loadingProfile
  } from '$lib/stores/auth.store';
  import { SSXOpenWeb3Modal } from '$lib/utils/ssx';
  import { Transition } from '@rgossiaux/svelte-headlessui';
  import SSXConnectButton from './SSXConnectButton.svelte';
  import OutsideAlerter from './OutsideAlerter.svelte';

  let showProfileDropdown = false;

  const toggleShow = () => (showProfileDropdown = !showProfileDropdown);

  let _profile: ProfileData | null = null;
  profile.subscribe((x) => (_profile = x));

  let _loadingProfile: LoadingProfile = false;
  loadingProfile.subscribe((x) => (_loadingProfile = x));

  const signOut = () => {
    toggleShow();
    SSXOpenWeb3Modal();
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
  <div class="relative ml-3">
    <div>
      {#if !_profile || _loadingProfile}
        <SSXConnectButton />
      {:else}
        <button
          on:click={toggleShow}
          type="button"
          class="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          id="user-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <span class="sr-only">Open user menu</span>
          <img
            class="h-8 w-8 rounded-full"
            src={_profile.avatar}
            alt={`${_profile.username} avatar`}
          />
        </button>
      {/if}
    </div>

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
        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
        tabindex="-1"
      >
        <!-- Active: "bg-gray-100", Not Active: "" -->
        <a
          href="/profile"
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
          role="menuitem"
          tabindex="-1"
          id="user-menu-item-0">Your Profile</a
        >

        <!-- <a
					href="/"
					class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
					role="menuitem"
					tabindex="-1"
					id="user-menu-item-1">Settings</a
				> -->

        <a
          href="/"
          on:click|preventDefault={_loadingProfile ? null : signOut}
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
          role="menuitem"
          tabindex="-1"
          id="user-menu-item-2">Sign out</a
        >
      </div>
    </Transition>
  </div>
</OutsideAlerter>
