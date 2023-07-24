<script lang="ts">
  import { page } from '$app/stores';
  import ArrowBack from '$lib/icons/ArrowBack.svelte';
  import { _loadingProfile, profile, type ProfileData } from '$lib/stores/auth.store';
  import { fetchBook, myList, reviews, type Books, books } from '$lib/stores/book.store';
  import { fetchUserData, userFollowingHandles } from '$lib/stores/users.store';
  import { toCredentialEntry } from '$lib/utils/rebase';
  import BookListItem from '../../BookListItem.svelte';
  import BookReview from '../../BookReview.svelte';
  import FollowButton from '../../FollowButton.svelte';
  import SSXConnectButton from '../../SSXConnectButton.svelte';
  import UpdateBookProgress from '../../UpdateBookProgress.svelte';

  export let data;
  const { userHandle } = data;

  let _profile: ProfileData | null = null;
  $: _profile, fetchData();
  profile.subscribe((x) => (_profile = x));

  let _books: Books | null = null;
  books.subscribe((x) => (_books = x));

  let _userFollowingHandles: Array<string> | null = null;
  let _myList: Array<any> | null = null;
  $: _myList, getMyListBookInfo();
  let _reviews: Array<any> | null = null;
  $: _reviews, getReviewsBookInfo();

  $: user = {} as ProfileData;
  $: view = 'POSTS';

  const goBack = () => {
    history.back();
  };

  const getMyListBookInfo = () => {
    if (_myList) {
      const bookList = _myList.map((item) => item.content.link.split('/').pop() ?? '');
      const promises: Array<Promise<any>> = [];
      bookList.forEach((item) => {
        promises.push(fetchBook(item));
      });
      Promise.all(promises);
    }
  };

  const getReviewsBookInfo = () => {
    if (_reviews) {
      const bookList = _reviews.map((item) => item.content.link.split('/').pop() ?? '');
      const promises: Array<Promise<any>> = [];
      bookList.forEach((item) => {
        promises.push(fetchBook(item));
      });
      Promise.all(promises);
    }
  };

  const fetchData = async () => {
    if (_profile) {
      if (userHandle === _profile.address) {
        user = _profile;
      } else {
        const userData = (await fetchUserData(userHandle)) ?? ({} as ProfileData);
        user = userData;
      }
      if (user?.address === _profile.address) {
        myList.subscribe(
          (x) =>
            (_myList = Object.values(x).map((xx) => {
              const entry: Record<string, any> = toCredentialEntry(xx);
              entry.content.bookId = entry.content.link.split('/').pop() ?? '';
              return entry;
            }))
        );
        reviews.subscribe(
          (x) =>
            (_reviews = Object.values(x)
              .flat()
              .map((xx) => toCredentialEntry(xx)))
        );
      } else {
        _myList = [];
        _reviews = [];
      }
      userFollowingHandles.subscribe((x) => (_userFollowingHandles = x));
    }
  };
</script>

<div class="bg-white dark:bg-gray-200 rounded-lg w-full max-w-3xl m-auto">
  {#if _profile && user && !_loadingProfile}
    <div class="p-4 flex items-center">
      <button on:click={goBack}>
        <ArrowBack class="w-4 h-4" />
      </button>
      <div class="ml-4">
        <span class="text-xl font-semibold">{user.username}</span>
        <br />
        <span class="text-sm">
          {_myList?.filter((ml) => ml.content.progress > -1).length ?? 0} Books
        </span>
      </div>
    </div>

    <div class="pt-4 px-6 border-y border-y-gray-300">
      <img class="h-32 w-32 rounded-full" src={user.avatar} alt={`${user.username} avatar`} />
      <div class="mt-2 flex flex-wrap justify-between items-center">
        <div class="block sm:flex items-center">
          <p class="text-xl font-semibold break-all">{user.username}</p>
          <p class="text-sm text-gray-500 sm:ml-2 break-all">@{user?.address}</p>
        </div>
        {#if _profile.address === user?.address}
          <a class="bg-gray-400 py-1 px-2 rounded-lg text-sm text-white" href="/profile">
            EDIT PROFILE
          </a>
        {:else}
          <FollowButton
            handle={user?.address}
            following={_userFollowingHandles?.includes(user?.address) ?? false}
          />
        {/if}
      </div>
      <div class="mt-2 flex flex-wrap items-center justify-center sm:justify-normal">
        <button on:click={() => (view = 'MY_BOOKS')}>
          <span class="text-sm font-semibold">
            {(
              '000' +
              (_myList?.filter(
                (ml) => ml.content.progress === _books?.[ml.content.bookId]?.pageCount
              ).length ?? 0)
            ).substr(-3)}
          </span>
          <span class="ml-2 text-xs text-gray-700">BOOKS READ</span>
        </button>
        <!-- <a href={$page.url.pathname + '/following'}>
          <span class="ml-0 xxs:ml-4 text-sm font-semibold">
            {('000' + (_userFollowingHandles?.length ?? 0)).substr(-3)}
          </span>
          <span class="ml-2 text-xs text-gray-700">FOLLOWING</span>
        </a>
        <a href={$page.url.pathname + '/followers'}>
          <span class="ml-0 xxs:ml-4 text-sm font-semibold">???</span>
          <span class="ml-2 text-xs text-gray-700">FOLLOWERS</span>
        </a> -->
      </div>
      <div class="mt-4 text-sm text-gray-500">
        {user?.credential?.description ?? ''}
      </div>
      <div class="flex flex-wrap border-b border-gray-100 text-sm font-medium">
        <button
          on:click={() => (view = 'POSTS')}
          class={`p-4 ${view === 'POSTS' ? 'text-blue-500' : 'hover:text-blue-500'}`}
        >
          Posts
        </button>
        <button
          on:click={() => (view = 'MY_BOOKS')}
          class={`p-4 ${view === 'MY_BOOKS' ? 'text-blue-500' : 'hover:text-blue-500'}`}
        >
          My books
        </button>
        <button
          on:click={() => (view = 'WANT_READ')}
          class={`p-4 ${view === 'WANT_READ' ? 'text-blue-500' : 'hover:text-blue-500'}`}
        >
          Want to read
        </button>
      </div>
    </div>

    {#if view === 'POSTS'}
      <div>
        {#each _reviews ?? [] as post}
          <BookReview
            class="px-6 py-4 border-b border-b-gray-300"
            review={post}
            {user}
            book={_books?.[post.content.link.split('/').pop()]}
          />
        {/each}
      </div>
    {:else if view === 'MY_BOOKS'}
      <div class="px-6 pt-10">
        <p class="font-semibold text-sm mb-2">Reading</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each _myList?.filter((b) => b.content.progress > 0 && b.content.progress < (_books?.[b.content.bookId]?.pageCount ?? 0)) ?? [] as book}
            <BookListItem
              title={_books?.[book.content.bookId].title ?? ''}
              authors={_books?.[book.content.bookId].authors ?? []}
              cover={_books?.[book.content.bookId].imageLinks?.thumbnail ?? ''}
            >
              <UpdateBookProgress
                id={_books?.[book.content.bookId].id ?? ''}
                totalPages={_books?.[book.content.bookId]?.pageCount ?? 0}
                currentPage={book.content.progress}
              />
            </BookListItem>
          {/each}
        </div>
        <p class="font-semibold text-sm mt-6 mb-2">Read</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each _myList?.filter((b) => b.content.progress === _books?.[b.content.bookId]?.pageCount) ?? [] as book}
            <BookListItem
              title={_books?.[book.content.bookId].title ?? ''}
              authors={_books?.[book.content.bookId].authors ?? []}
              cover={_books?.[book.content.bookId].imageLinks?.thumbnail ?? ''}
            >
              <UpdateBookProgress
                id={_books?.[book.content.bookId].id ?? ''}
                totalPages={_books?.[book.content.bookId]?.pageCount ?? 0}
                currentPage={book.content.progress}
              />
            </BookListItem>
          {/each}
        </div>
      </div>
    {:else}
      <div class="px-6 pt-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each _myList?.filter((b) => b.content.progress === 0) ?? [] as book}
            <BookListItem
              title={_books?.[book.content.bookId].title ?? ''}
              authors={_books?.[book.content.bookId].authors ?? []}
              cover={_books?.[book.content.bookId].imageLinks?.thumbnail ?? ''}
            >
              <UpdateBookProgress
                id={_books?.[book.content.bookId].id ?? ''}
                totalPages={_books?.[book.content.bookId]?.pageCount ?? 0}
                currentPage={book.content.progress}
              />
            </BookListItem>
          {/each}
        </div>
      </div>
    {/if}
    <div class="p-6" />
  {:else}
    <div class="py-10 px-6">
      You are not signed in.
      <br />
      <br />
      <SSXConnectButton />
    </div>
  {/if}
</div>
