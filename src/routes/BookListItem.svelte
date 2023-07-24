<script lang="ts">
  export let title: string;
  export let authors: Array<string> | null;
  export let cover: string;
</script>

<div class="block xxs:flex">
  <img class="m-auto" src={cover} alt={`${title} cover`} />
  <div class="ml-2 w-fill-available">
    <span class="text-sm font-bold">{title}</span><br />
    {#if authors}
      <span class="text-xs"> by {authors.join(', ')} </span>
      <br />
    {/if}
    <slot />
  </div>
</div>
