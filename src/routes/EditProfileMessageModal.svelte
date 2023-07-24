<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    loadingProfile,
    profile,
    type LoadingProfile,
    type ProfileData
  } from '$lib/stores/auth.store';

  $: open = false;

  let _profile: ProfileData | null = null;
  $: _profile, verifyProfile();
  profile.subscribe((x) => (_profile = x));

  let _loadingProfile: LoadingProfile | null = null;
  $: _loadingProfile, verifyProfile();
  loadingProfile.subscribe((x) => (_loadingProfile = x));

  const verifyProfile = () => {
    if (_profile && !_loadingProfile && (!_profile.username || !_profile.avatar)) {
      open = true;
    }
  };
</script>

<div
  class:hidden={!open}
  class="relative z-10"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
      >
        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start" />
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Edit Your Profile</h3>
        </div>
        <div
          class="bg-white dark:bg-gray-800 border-t border-t-gray-200 dark:border-t-gray-600 px-4 py-3 sm:px-6"
        >
          <p class="dark:text-white">
            It looks like you don't have all your profile data yet. Fill in the fields so that your
            profile is complete!
          </p>
        </div>
        <div
          class="bg-white dark:bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 sm:justify-center"
        >
          <button
            on:click={() => {
              goto('/profile');
              open = false;
            }}
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-blue-1 px-3 py-2 text-sm font-semibold min-w-[150px] text-gray-100 shadow-sm sm:mt-0 sm:ml-3 sm:w-auto"
          >
            EDIT MY PROFILE
          </button>
          <button
            on:click={() => (open = false)}
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-transparent border border-red-600 text-red-600 px-3 py-2 text-sm font-semibold min-w-[150px] shadow-sm hover:bg-red-600 hover:text-white sm:w-auto"
          >
            I DON'T CARE
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
