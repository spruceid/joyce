<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ArrowBack from '$lib/icons/ArrowBack.svelte';
  import {
    DEFAULT_USER_AVATAR,
    fetchUserFollowing,
    userFollowingHandles
  } from '$lib/stores/users.store.js';
  import FollowButton from '../../../FollowButton.svelte';
  import type { SSX } from '@spruceid/ssx';
  import { ssx, type ProfileData } from '$lib/stores/auth.store';

  export let data;

  let _ssx: SSX | null = null;
  $: _ssx, fetchData();
  ssx.subscribe((x) => (_ssx = x));

  let _userFollowingHandles: Array<string> | null = null;
  userFollowingHandles.subscribe((x) => (_userFollowingHandles = x));

  const { user } = data;

  let following: Array<ProfileData> | undefined;
  $: following = [];
  $: view = data.type;

  const goBack = () => {
    let location = $page.url.pathname.split('/');
    location.pop();
    goto(location.join('/'));
  };

  const fetchData = async () => {
    if (_ssx) {
      following = await fetchUserFollowing();
    }
  };
</script>

<div class="bg-white dark:bg-gray-200 rounded-lg w-full max-w-3xl m-auto">
  <div class="p-4 flex items-center">
    <button on:click={goBack}>
      <ArrowBack class="w-4 h-4" />
    </button>
    <div class="ml-4">
      <span class="text-xl font-semibold break-all">{user.username}</span>
      <br />
      <span class="text-sm">219 Books</span>
    </div>
  </div>

  <div class="px-6 border-y border-y-gray-300">
    <div class="flex flex-wrap border-b border-gray-100 text-sm font-medium">
      <button
        on:click={() => (view = 'followers')}
        class={`p-4 ${view === 'followers' ? 'text-blue-500' : 'hover:text-blue-500'}`}
      >
        Followers
      </button>
      <button
        on:click={() => (view = 'following')}
        class={`p-4 ${view === 'following' ? 'text-blue-500' : 'hover:text-blue-500'}`}
      >
        Following
      </button>
    </div>
  </div>

  {#if view === 'followers'}
    <div>
      {#each { length: 7 } as follower, i}
        <div class="px-6 my-2 py-4 border-b">
          <div class="block md:flex wrap items-center justify-between">
            <div class="flex wrap items-center">
              <img
                class="h-10 w-10 rounded-full mr-2"
                src={DEFAULT_USER_AVATAR}
                alt={`user's avatar`}
              />
              <p>
                <b class="text-lg break-all">Mr. Cheeseburguer</b>
                <br class="content-['123'] block text-[24%] -m-[2em]" />
                <span class="text-xs text-gray-500 break-all"> @slimshaddy </span>
              </p>
            </div>
            <FollowButton handle={''} following={false} />
          </div>
        </div>
      {/each}
    </div>
  {:else if view === 'following'}
    <div>
      {#each following ?? [] as f}
        <div class="px-6 my-2 py-4 border-b">
          <div class="block md:flex wrap items-center justify-between">
            <div class="flex wrap items-center">
              <img class="h-10 w-10 rounded-full mr-2" src={f.avatar} alt={`user's avatar`} />
              <p>
                <b class="text-lg break-all">{f.username}</b>
                <br class="content-['123'] block text-[24%] -m-[2em]" />
                <span class="text-xs text-gray-500 break-all"> @{f.address} </span>
              </p>
            </div>
            <FollowButton
              handle={f.address}
              following={_userFollowingHandles?.includes(f.address) ?? false}
            />
          </div>
        </div>
      {/each}
    </div>
  {/if}
  <div class="p-6" />
</div>
