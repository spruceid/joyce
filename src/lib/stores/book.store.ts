import { writable, type Writable } from 'svelte/store';
import { _ssx } from './auth.store';

export interface GoogleBookIndustryIdentifier {
  type: string;
  identifier: string;
}

export interface GoogleBookImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
}

export interface GoogleBookItem {
  id: string;
  title: string;
  subtitle?: string;
  authors?: Array<string>;
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: Array<GoogleBookIndustryIdentifier>;
  pageCount?: number;
  printType?: string;
  categories?: Array<string>;
  averageRating?: number;
  ratingsCount?: number;
  maturityRating?: string;
  imageLinks?: GoogleBookImageLinks;
  language?: string;
}

export interface GoogleBookAPIResponse {
  items: Array<Record<string, GoogleBookItem>>;
  kind: string;
  totalItems: number;
}

export interface GoogleBookItemAPIResponse {
  kind: string;
  id: string;
  volumeInfo: GoogleBookItem;
}

export type Reviews = Record<string, Array<string>>;

export const reviews: Writable<Reviews> = writable({});
export let _reviews: Reviews | null = null;
reviews.subscribe((x) => (_reviews = x));

export type Books = Record<string, GoogleBookItem>;

export const books: Writable<Books> = writable({});
export let _books: Books | null = null;
books.subscribe((x) => (_books = x));

export type MyList = Record<string, string>;

export const myList: Writable<MyList> = writable({});
export let _myList: MyList | null = null;
myList.subscribe((x) => (_myList = x));

export const fetchBook = async (bookId: string) => {
  if (_books?.[bookId]) {
    return;
  }
  fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then((response) => response.json())
    .then((response: GoogleBookItemAPIResponse) => {
      const book = {
        ...response.volumeInfo,
        id: response.id
      };
      // Save data to use it if the user selects the book
      books.set({
        ..._books,
        [bookId]: book
      });
    })
    .catch(console.error);
};
