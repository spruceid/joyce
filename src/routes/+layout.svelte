<script lang="ts">
  import '../app.css';
  import Navbar from './Navbar.svelte';
  import Alert from './Alert.svelte';
  import EditProfileMessageModal from './EditProfileMessageModal.svelte';
  import SSXConnectModal from './SSXConnectModal.svelte';
  import OutsideAlerter from './OutsideAlerter.svelte';
  import { showAlert } from '$lib/stores/alert.store';
  import { disconnect } from '@wagmi/core';
  import { loadingProfile, showLoader, type LoadingProfile } from '$lib/stores/auth.store';

  export let _loadingProfile: LoadingProfile = false;
  loadingProfile.subscribe((x) => (_loadingProfile = x));
  export let _showLoader: boolean = false;
  showLoader.subscribe((x) => (_showLoader = x));
</script>

<div
  class="absolute bg-black opacity-0 w-full h-full top-0 left-0 z-20 transition-all duration-300"
  class:opacity-60={_loadingProfile}
  class:pointer-events-none={!_loadingProfile}
/>

<OutsideAlerter
  onAlert={() => {
    if (!_showLoader) {
      if (_loadingProfile === 'createOrbit') {
        showAlert.set({
          variant: 'error',
          message: 'Modal closed before orbit creation'
        });
        disconnect();
      }
      loadingProfile.set(false);
    }
  }}
>
  <SSXConnectModal />
</OutsideAlerter>
<div class="min-h-full">
  <Navbar />

  <!-- <header class="bg-white dark:bg-gray-900 shadow">
		<div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200">Joyce</h1>
		</div>
	</header> -->
  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <!-- Replace with your content -->
      <div class="px-4 py-6 sm:px-0">
        <slot />
      </div>
      <!-- /End replace -->
    </div>
  </main>
  <Alert />
  <EditProfileMessageModal />
</div>
