<script lang="ts">
  import { goto } from '$app/navigation';
  import { books, type Books, type GoogleBookAPIResponse } from '$lib/stores/book.store';
  import Svelecte, { addFormatter } from 'svelecte';

  let _books: Books | null = null;
  books.subscribe((x) => (_books = x));

  const fetchCallback = (response: GoogleBookAPIResponse) => {
    const booksResponse = response.items
      .map(({ id, volumeInfo }) => ({ id, ...volumeInfo }))
      .filter((item) => item.imageLinks?.thumbnail);

    // Save data to use it if the user selects the book
    books.set({
      ..._books,
      ...booksResponse.reduce((acc, value) => ({ ...acc, [value.id]: value }), {})
    });
    return response.items.map(({ id, volumeInfo }) => ({ id, ...volumeInfo }));
  };

  function volumeRenderer(item: any, isSelected: boolean) {
    if (isSelected) {
      return `<div>
        ${item.title}${item.subtitle ? ': ' + item.subtitle : ''}
      </div>`;
    }
    return `
			<span class="flex items-center">
				${
          item.imageLinks?.smallThumbnail
            ? `
						<img 
							class="w-16 mr-2"
							src=${item.imageLinks?.smallThumbnail}
							alt="${item.title} cover"
						/>
					`
            : ''
        }
				<br/>
				<div ${!item.imageLinks?.smallThumbnail ? 'class="py-4"' : ''}>
					<span class="text-lg font-medium text-gray-800">
						${item.title}${item.subtitle ? ': ' + item.subtitle : ''}
					</span>
					<br/>
					<span class="text-sm font-light text-gray-500">
						${item.authors?.join(', ') ?? ''} ${item.authors && item.publishedDate ? '·' : ''} ${
      item.publishedDate?.split('-')[0] ?? ''
    }
					</span>
				</div>
			</span>
		`;
  }

  addFormatter({
    'volume-blocks': volumeRenderer
  });

  const selectVolume = (e: CustomEvent) => {
    if (e.detail) {
      goto(`/volumes/${e.detail.id}`);
    }
  };
</script>

<Svelecte
  placeholder="Search for book"
  minQuery={3}
  fetch="https://www.googleapis.com/books/v1/volumes?q=[query]&maxResults=40"
  {fetchCallback}
  on:change={selectVolume}
  valueAsObject
  allowEditing
  renderer="volume-blocks"
/>
