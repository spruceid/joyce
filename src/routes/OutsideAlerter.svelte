<script lang="ts">
  import { onMount } from 'svelte';

  export let onAlert = () => {};

  let wrapperRef: any = null;

  const handleClickOutside = (event: MouseEvent): void => {
    if (wrapperRef && !wrapperRef?.contains(event.target)) {
      onAlert();
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
</script>

<div class="relative" bind:this={wrapperRef}>
  <slot />
</div>
