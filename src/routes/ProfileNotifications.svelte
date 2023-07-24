<script lang="ts">
  import ProfileDropdown from './ProfileDropdown.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
</script>

<div class="hidden md:block">
  <div class="ml-4 flex items-center md:ml-6">
    <div class="mx-4">
      <ThemeToggle />
    </div>
    <ProfileDropdown />
  </div>
</div>
