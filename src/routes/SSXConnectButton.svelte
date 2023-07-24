<script lang="ts">
  import {
    profile,
    type LoadingProfile,
    type ProfileData,
    loadingProfile
  } from '$lib/stores/auth.store';
  import { SSXOpenWeb3Modal } from '$lib/utils/ssx';

  export let signIn: () => void | Promise<void> = () => {
    loadingProfile.set('signIn');
  };
  export let signOut: () => void | Promise<void> = SSXOpenWeb3Modal;
  export let hideOnSignIn: boolean = false;

  let _profile: ProfileData | null = null;
  profile.subscribe((x) => (_profile = x));

  let _loadingProfile: LoadingProfile = false;
  loadingProfile.subscribe((x) => (_loadingProfile = x));
</script>

{#if !_profile || _loadingProfile}
  <button
    class="px-3 py-2 rounded-md text-sm font-medium bg-blue-1 text-white"
    on:click|preventDefault={_loadingProfile ? null : signIn}
  >
    {#if _loadingProfile}
      {#if _profile}
        FETCHING PROFILE...
      {:else}
        CONNECTING...
      {/if}
    {:else}
      CONNECT WALLET
    {/if}
  </button>
{:else if !hideOnSignIn}
  <button
    class="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-900 dark:text-gray-300 dark:bg-gray-900 dark:text-white"
    on:click|preventDefault={_loadingProfile ? null : signOut}
  >
    SIGN-OUT
  </button>
{/if}
