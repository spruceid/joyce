<script lang="ts">
  import { showMobileMenu } from '$lib/stores/mobile-menu.store';
  import MobileMenu from './MobileMenu.svelte';
  import MobileMenuButton from './MobileMenuButton.svelte';
  import NavbarItems from './NavbarItems.svelte';
  import ProfileNotifications from './ProfileNotifications.svelte';
  import SearchBookInput from './SearchBookInput.svelte';
  import { navigating, page } from '$app/stores';

  $: if ($navigating) queryParams = $page.url.searchParams.get('query');

  let queryParams = $page.url.searchParams.get('query');
</script>

<nav class="dark:bg-gray-800 bg-white sticky top-0 z-10">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center">
      <NavbarItems />
      <SearchBookInput bind:queryParams />
      <ProfileNotifications />
      <MobileMenuButton />
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  {#if $showMobileMenu}
    <MobileMenu />
  {/if}
</nav>
