<script lang="ts">
  import {
    loadingProfile,
    profile,
    type LoadingProfile,
    type ProfileData
  } from '$lib/stores/auth.store';
  import { SSXOpenWeb3Modal } from '$lib/utils/ssx';
  import ActiveLink from './ActiveLink.svelte';
  import SSXConnectButton from './SSXConnectButton.svelte';

  let _profile: ProfileData | null = null;
  profile.subscribe((x) => (_profile = x));

  let _loadingProfile: LoadingProfile;
  loadingProfile.subscribe((x) => (_loadingProfile = x));

  const signOut = () => {
    SSXOpenWeb3Modal();
  };
</script>

<div class="md:hidden bg-gray-900" id="mobile-menu">
  {#if !_profile || _loadingProfile}
    <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
      <SSXConnectButton />
    </div>
  {:else}
    <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
      <ActiveLink
        href={`/feed/${_profile.address}`}
        baseClass="block px-3 py-2 rounded-md text-base font-medium"
        activeClass="bg-gray-200 text-gray-900 dark:text-gray-300 dark:bg-gray-900 dark:text-white"
        defaultClass="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900"
      >
        My Feed
      </ActiveLink>
    </div>
    <div class="border-t border-gray-700 pt-4 pb-3">
      <div class="flex items-center px-5">
        <div class="flex-shrink-0">
          <img
            class="h-10 w-10 rounded-full"
            src={_profile.avatar}
            alt={`${_profile.username} avatar`}
          />
        </div>
        <div class="ml-3">
          <div class="text-base font-medium leading-none text-black dark:text-gray-200">
            {_profile.username}
          </div>
          <div class="text-sm font-medium leading-none text-gray-400">{_profile.address}</div>
        </div>
      </div>
      <div class="mt-3 space-y-1 px-2">
        <ActiveLink
          href={`/profile`}
          baseClass="block px-3 py-2 rounded-md text-base font-medium"
          activeClass="bg-gray-200 text-gray-900 dark:text-gray-300 dark:bg-gray-900 dark:text-white"
          defaultClass="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900"
        >
          Your Profile
        </ActiveLink>
        <a
          href="/"
          on:click|preventDefault={_loadingProfile ? null : signOut}
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900"
          >Sign out</a
        >
      </div>
    </div>
  {/if}
</div>
