<script>
  import { toggleMobileMenu } from '$lib/stores/mobile-menu.store';
  import ThemeToggle from './ThemeToggle.svelte';
</script>

<div class="-mr-2 flex md:hidden">
  <div class="m-2">
    <ThemeToggle />
  </div>
  <!-- Mobile menu button -->
  <button
    type="button"
    on:click={toggleMobileMenu}
    class="inline-flex items-center justify-center rounded-md dark:bg-gray-800 p-2 text-gray-400 dark:hover:bg-gray-700 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-offset-gray-400"
    aria-controls="mobile-menu"
    aria-expanded="false"
  >
    <span class="sr-only">Open main menu</span>
    <!--
			Heroicon name: outline/bars-3

			Menu open: "hidden", Menu closed: "block"
		-->
    <svg
      class="block h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
    <svg
      class="hidden h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>
