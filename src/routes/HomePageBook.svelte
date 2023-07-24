<script lang="ts">
  import { goto } from '$app/navigation';

  export let id: string | undefined;
  export let thumbnail: string | undefined;
  export let title: string | undefined;
</script>

{#if id}
  <a href={`/volumes/${id}`}>
    <img
      class="rounded-lg w-[150px] h-[230px] m-auto hover:scale-105 transition-all cursor-pointer"
      src={thumbnail}
      alt={`${title} cover`}
    />
  </a>
{:else}
  <div class="bg-gray-800 dark:bg-gray-400 rounded-lg w-[150px] h-[230px] m-auto" />
{/if}
