<script lang="ts">
  import DarkIcon from '$lib/icons/DarkIcon.svelte';
  import LightIcon from '$lib/icons/LightIcon.svelte';
  import { showAlert } from '$lib/stores/alert.store';
  import { fetchDappPreferences } from '$lib/stores/app.store';
  import { profile, type ProfileData } from '$lib/stores/auth.store';
  import { issue } from '$lib/stores/credentials.store';
  import { toCredentialEntry } from '$lib/utils/rebase';

  let _profile: ProfileData | null = null;
  $: _profile, fetchDappSettings();
  profile.subscribe((x) => (_profile = x));

  $: darkModeEnabled = false;

  const fetchDappSettings = async () => {
    if (_profile) {
      try {
        let dappPreferences = await fetchDappPreferences();
        if (dappPreferences) {
          dappPreferences = toCredentialEntry(dappPreferences);
          darkModeEnabled = dappPreferences.content.dark_mode;
          setTheme(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const toggleDarkMode = () => {
    darkModeEnabled = !darkModeEnabled;
    setTheme();
  };

  const setTheme = async (isOnMount: boolean = false) => {
    try {
      if (_profile && !isOnMount) {
        await issue('DappPreferencesAttestation', { dark_mode: darkModeEnabled });
      }
      if (darkModeEnabled) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      showAlert.set({
        variant: 'error',
        message: e as string
      });
    }
  };
</script>

<div class="space-x-2 justify-center self-center">
  <div class="relative inline-flex items-center cursor-pointer">
    <button
      type="button"
      class="rounded-full dark:bg-gray-800 p-1 text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
      on:click={toggleDarkMode}
    >
      {#if darkModeEnabled}
        <LightIcon class="w-6 h-6" />
      {:else}
        <DarkIcon class="w-6 h-6" />
      {/if}
    </button>
  </div>
</div>
