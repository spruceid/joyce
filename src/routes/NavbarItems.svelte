<script lang="ts">
  import { profile, type ProfileData } from '$lib/stores/auth.store';
  import ActiveLink from './ActiveLink.svelte';

  let _profile: ProfileData | null = null;
  $: _profile, updateLinks();
  profile.subscribe((x) => (_profile = x));

  $: links = [];

  const updateLinks = () => {
    if (_profile) {
      if (links.filter((link: any) => link.title === 'My Feed').length === 0) {
        links = [
          ...links,
          {
            href: `/feed/${_profile.address}`,
            title: 'My Feed'
          }
        ];
      }
    } else {
      links = links?.filter((link) => link.title !== 'My Feed');
    }
  };
</script>

<div class="flex items-center">
  <div class="flex-shrink-0 dark:text-white">
    <a href="/" class="font-bold">Joyce</a>
  </div>
  <div class="hidden md:block">
    <div class="ml-10 flex items-baseline space-x-8">
      {#each links as { href, title }}
        <ActiveLink
          {href}
          baseClass="px-3 py-2 rounded-md text-sm font-medium"
          activeClass="bg-gray-200 text-gray-900 dark:text-gray-300 dark:bg-gray-900 dark:text-white"
          defaultClass="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900"
        >
          {title}
        </ActiveLink>
      {/each}
    </div>
  </div>
</div>
