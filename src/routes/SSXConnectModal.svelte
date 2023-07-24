<script lang="ts">
  import { showLoader, loadingProfile, type LoadingProfile } from '$lib/stores/auth.store';
  import { SSXOpenWeb3Modal, createOrbitAndRetrieveProfile } from '$lib/utils/ssx';
  import CheckIcon from './CheckIcon.svelte';
  import Spinner from './Spinner.svelte';

  export let title = 'Sign in With Ethereum + Authorization';
  export let _loadingProfile: LoadingProfile = false;
  loadingProfile.subscribe((x) => (_loadingProfile = x));
  export let _showLoader: boolean = false;
  showLoader.subscribe((x) => (_showLoader = x));

  const getStep = (loadingProfile: LoadingProfile) => {
    switch (loadingProfile) {
      case false:
      case 'signIn':
        return 1;
      case 'createOrbit':
        return 2;
      default:
        return 0;
    }
  };
</script>

<div
  class="fixed drop-shadow-lg bg-white text-black px-8 py-4 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg max-w-md w-full z-30"
  class:hidden={!_loadingProfile || _loadingProfile === 'signOut'}
>
  <div class="flex items-center justify-center my-8">
    {#each Array.from({ length: 2 }, (_, i) => i + 1) as stepCounter}
      <div
        class="w-6 h-6 rounded-full flex items-center justify-center text-sm mx-2 font-semibold"
        class:border={getStep(_loadingProfile) < stepCounter}
        class:border-blue-1={getStep(_loadingProfile) < stepCounter}
        class:text-blue-1={getStep(_loadingProfile) < stepCounter}
        class:bg-blue-1={getStep(_loadingProfile) >= stepCounter}
        class:text-white={getStep(_loadingProfile) >= stepCounter}
      >
        {#if getStep(_loadingProfile) > stepCounter}
          <CheckIcon class="form-step-counter-done" />
        {:else}
          {stepCounter}
        {/if}
      </div>
    {/each}
  </div>
  {#if _loadingProfile === 'createOrbit'}
    <div>
      <h3 class="text-3xl font-bold mt-8 mb-4 text-center">Create Data Vault</h3>
      <div class="text-center min-h-[100px] flex items-start justify-center">
        You don't currently have a data vault. <br />
        Sign the message to create your data vault.
      </div>
      <div class="mt-4 mb-8 h-[42px] text-center">
        <button
          class="px-3 py-2 rounded-md text-sm font-medium bg-blue-1 text-white"
          on:click|preventDefault={createOrbitAndRetrieveProfile}
          disabled={_showLoader}
        >
          {#if _showLoader}
            <Spinner />
          {:else}
            CREATE DATA VAULT
          {/if}
        </button>
      </div>
    </div>
  {:else if _loadingProfile === 'signIn'}
    <div>
      <h3 class="text-3xl font-bold mt-8 mb-4 text-center">
        {title}
      </h3>
      <div class="text-center min-h-[100px] flex items-start justify-center">
        <div>
          Sign in With Ethereum and authorize Joyce to have access to read/write to your data vault.
          By logging in you accept our
          <a href="https://spruceid.com/termsofuse" class="text-blue-1" target="_blank">
            terms of use</a
          >
          and
          <a href="https://spruceid.com/privacypolicy" class="text-blue-1" target="_blank"
            >privacy policy</a
          >.
        </div>
      </div>
      <div class="mt-4 mb-8 h-[42px] text-center">
        <button
          class="px-3 py-2 rounded-md text-sm font-medium bg-blue-1 text-white"
          on:click|preventDefault={SSXOpenWeb3Modal}
          disabled={_showLoader}
        >
          {#if _showLoader}
            <Spinner />
          {:else}
            CONNECT WALLET
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>
