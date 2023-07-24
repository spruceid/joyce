<script lang="ts">
  import type { GoogleBookItem } from '$lib/stores/book.store';
  import BookDetails from '../../BookDetails.svelte';

  export let data: GoogleBookItem;
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<BookDetails book={data} />
