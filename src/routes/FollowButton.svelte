<script lang="ts">
  import { showAlert } from '$lib/stores/alert.store';
  import { issue } from '$lib/stores/credentials.store';
  import { removeFollowing } from '$lib/stores/users.store';

  export let handle: string;
  export let following: boolean;

  const follow = async () => {
    try {
      await issue('FollowAttestation', {
        target: `https://joyce.spruceid.xyz/feed/${handle}`
      });
    } catch (e) {
      showAlert.set({
        variant: 'error',
        message: e as string
      });
    }
  };

  const unfollow = async () => {
    await removeFollowing(handle);
  };
</script>

{#if !following}
  <button
    class="ml-12 mt-2 md:ml-0 md:mt-0 text-xs bg-blue-600 rounded-lg px-4 py-1 text-white"
    on:click={follow}
  >
    FOLLOW
  </button>
{:else}
  <button
    class="ml-12 mt-2 md:ml-0 md:mt-0 text-xs bg-gray-400 rounded-lg px-4 py-1 text-white"
    on:click={unfollow}
  >
    FOLLOWING
  </button>
{/if}
