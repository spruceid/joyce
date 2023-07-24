<script lang="ts">
  import { showAlert } from '$lib/stores/alert.store';
  import { issue } from '$lib/stores/credentials.store';

  export let id: string;
  export let totalPages: number;

  /**
   * -1                      = DROPPED
   * 0                       = WANT TO READ
   * N > 0 && N < totalPages = IN PROGRESS
   * N === totalPages        = FINISHED
   */
  export let currentPage: number;

  $: tmpCurrentPage = currentPage;
  $: if (tmpCurrentPage > totalPages) tmpCurrentPage = totalPages;

  $: editing = false;

  const toggleEditing = () => {
    editing = !editing;
  };

  const updateCurrentPage = async (currPage: number) => {
    currentPage = currPage;
    try {
      await issue('ProgressBookLinkAttestation', {
        link: `https://www.googleapis.com/books/v1/volumes/${id}`,
        progress: currPage
      });
      if (editing) {
        toggleEditing();
      }
    } catch (e) {
      console.error(e);
      showAlert.set({
        variant: 'error',
        message: e as string
      });
    }
  };
</script>

{#if !editing}
  {#if currentPage > 0 && currentPage < totalPages}
    <div class="flex items-center">
      <div class="w-1/2">
        <span
          role="progressbar"
          aria-labelledby="ProgressLabel"
          aria-valuenow={(currentPage / totalPages) * 100}
          class="block rounded-full bg-gray-200 dark:bg-gray-300"
        >
          <span
            class="block h-3 rounded-full bg-green-600"
            style={`width:${(currentPage / totalPages) * 100}%`}
          />
        </span>
      </div>
      <span class="text-xs text-gray-500 ml-2">
        <input
          readonly
          class="h-8 w-14 pr-1 text-right border border-white dark:border-gray-200 dark:bg-gray-200 rounded-md focus:outline-white focus:dark:outline-gray-200"
          value={currentPage}
        />
        /{totalPages}
      </span>
    </div>
  {/if}
  <button class="mt-2 px-4 py-1 text-sm text-gray-400" on:click={() => updateCurrentPage(-1)}
    >REMOVE</button
  >
  <button
    class="mt-2 text-sm px-4 py-1 rounded-md text-sm bg-blue-1 text-white"
    on:click={toggleEditing}
  >
    UPDATE
  </button>
{:else}
  <div class="flex items-center">
    <div class="w-1/2">
      <span
        role="progressbar"
        aria-labelledby="ProgressLabel"
        aria-valuenow={(tmpCurrentPage / totalPages) * 100}
        class="block rounded-full bg-gray-200 dark:bg-gray-300"
      >
        <span
          class="block h-3 rounded-full bg-green-600"
          style={`width:${(tmpCurrentPage / totalPages) * 100}%`}
        />
      </span>
    </div>
    <span class="text-xs text-gray-500 ml-2">
      <input
        type="number"
        bind:value={tmpCurrentPage}
        class="h-8 w-14 pr-1 text-right border rounded-md text-center dark:text-white dark:bg-gray-800"
      />
      /{totalPages}
    </span>
  </div>
  <button class="mt-2 px-4 py-1 text-sm text-gray-400" on:click={() => updateCurrentPage(-1)}
    >REMOVE</button
  >
  <button
    class="mt-2 text-sm px-4 py-1 rounded-md text-sm bg-blue-1 text-white"
    on:click={() => updateCurrentPage(tmpCurrentPage)}
  >
    SAVE
  </button>
{/if}
