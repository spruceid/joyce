<script lang="ts">
  import { showAlert } from '$lib/stores/alert.store';
  import { DEFAULT_ACCOUNT_AVATAR, profile, type ProfileData } from '$lib/stores/auth.store';
  import { issue } from '$lib/stores/credentials.store';
  import { updateMyProfile } from '$lib/utils/auth';
  import SSXConnectButton from '../SSXConnectButton.svelte';

  let _profile: ProfileData | null = null;
  $: _profile, fillFields();
  profile.subscribe((x) => (_profile = x));

  $: avatar = '';
  $: domain = '';
  $: bio = '';

  const fillFields = () => {
    if (_profile) {
      avatar = _profile.avatar ?? DEFAULT_ACCOUNT_AVATAR;
      domain = _profile.username ?? '';
      bio = _profile.credential?.description ?? '';
    } else {
      avatar = '';
      domain = '';
      bio = '';
    }
  };

  const saveChanges = async () => {
    try {
      const credential = {
        description: bio,
        image: avatar,
        username: domain,
        website: `https://joyce.spruceid.xyz/${_profile?.address}`
      };
      await issue('BasicProfileAttestation', credential);
      updateMyProfile(credential);
    } catch (e) {
      showAlert.set({
        variant: 'error',
        message: e as string
      });
    }
  };
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<div class="bg-white dark:bg-gray-200 rounded-lg w-full max-w-2xl m-auto px-4 sm:px-12 py-6">
  {#if _profile}
    <h1 class="text-center text-2xl font-bold">Your Profile</h1>
    <img
      class="rounded-full max-w-[200px] m-auto my-4"
      src={!avatar ? DEFAULT_ACCOUNT_AVATAR : avatar}
      alt={`${domain} avatar`}
    />

    <span class="block ml-2 mb-1 text-sm font-medium text-gray-900"> Name </span>
    <input
      bind:value={domain}
      class="block p-2.5 mb-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />

    <span class="block ml-2 mb-1 text-sm font-medium text-gray-900"> Username </span>
    <input
      readonly
      value={`@${_profile.address}`}
      class="block p-2.5 mb-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />

    <span class="block ml-2 mb-1 text-sm font-medium text-gray-900"> Avatar URL </span>
    <input
      bind:value={avatar}
      class="block p-2.5 mb-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />

    <span class="block ml-2 mb-1 text-sm font-medium text-gray-900"> Bio </span>
    <textarea
      rows="4"
      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Bio here..."
      bind:value={bio}
    />

    <button class="flex flex-wrap items-center mb-4 mt-20" on:click={saveChanges}>
      <div class="w-[25px] h-[25px] rounded-full bg-gray-700 mr-2" />
      <span class="text-gray-400 font-semibold">SAVE CHANGES</span>
    </button>
    <!-- <button class="flex flex-wrap items-center mb-4">
      <div class="w-[25px] h-[25px] rounded-full bg-gray-700 mr-2" />
      <span class="text-gray-400 font-semibold">DOWNLOAD ALL DATA</span>
    </button>
    <button class="flex flex-wrap items-center my-4">
      <div class="w-[25px] h-[25px] rounded-full bg-gray-700 mr-2" />
      <span class="text-red-500 font-semibold">DELETE ACCOUNT</span>
    </button> -->
  {:else}
    You are not signed in.
    <br />
    <br />
    <SSXConnectButton />
  {/if}
</div>
