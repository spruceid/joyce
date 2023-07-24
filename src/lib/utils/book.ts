import { _ssx } from '$lib/stores/auth.store';
import { _myList, _reviews, myList, reviews } from '$lib/stores/book.store';
import { getFromKepler, listKeplerFiles } from '$lib/stores/credentials.store';
import { CredentialTypesEnum } from './rebase';

export const fetchAllReviews = async (fileList: Array<string> = []) => {
  if (_ssx) {
    if (!fileList) {
      fileList = await listKeplerFiles();
    }
    fileList = fileList.filter((file: string) =>
      file.includes(CredentialTypesEnum.BookReviewAttestation)
    );
    try {
      const promises: Array<Promise<any>> = [];
      fileList.forEach((file: string) => {
        promises.push(
          getFromKepler(
            `joyce/public/${CredentialTypesEnum.BookReviewAttestation}/${file.split('/').pop()}`
          )
        );
      });
      const data = await Promise.all(promises);
      const myReviews: Record<string, Array<string>> = {};
      data.forEach((d, i) => {
        const bookId: string = fileList[i].split('/').pop() ?? '';
        if (myReviews[bookId]) {
          myReviews[bookId].push(d);
        } else {
          myReviews[bookId] = [d];
        }
      });
      reviews.set(myReviews);
    } catch (e) {
      console.error(e);
    }
  }
};

export const fetchMyList = async (fileList: Array<string> = []) => {
  if (_ssx) {
    if (!fileList) {
      fileList = await listKeplerFiles();
    }
    fileList = fileList.filter((file: string) =>
      file.includes(CredentialTypesEnum.ProgressBookLinkAttestation)
    );
    try {
      const promises: Array<Promise<any>> = [];
      fileList.forEach((file: string) => {
        promises.push(
          getFromKepler(
            `joyce/public/${CredentialTypesEnum.ProgressBookLinkAttestation}/${file
              .split('/')
              .pop()}`
          )
        );
      });
      const data = await Promise.all(promises);
      const myListItems: Record<string, string> = {};
      data.forEach((d, i) => {
        const bookId: string = fileList[i].split('/').pop() ?? '';
        myListItems[bookId] = d;
      });
      myList.set(myListItems);
    } catch (e) {
      console.error(e);
    }
  }
};

export const fetchReviews = async (bookId: string) => {
  const bookMetadata = await fetch(`/api/reviews?bookId=${bookId}`).then((res) => res.json());
  if (_ssx) {
    try {
      // TODO: how to fetch data from ones orbit?
      const keplerReviews = await Promise.all(
        bookMetadata.reviewers.map((address) => {
          return getFromKepler(
            `joyce/public/${CredentialTypesEnum.BookReviewAttestation}/${bookId}`
          );
        })
      );
      if (keplerReviews) {
        const review = _reviews ?? {};
        review[bookId] = keplerReviews;
        reviews.set(review);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return bookMetadata;
};

export const fetchBookFromMyList = async (bookId: string) => {
  if (_ssx) {
    try {
      const data = await getFromKepler(
        `joyce/public/${CredentialTypesEnum.ProgressBookLinkAttestation}/${bookId}`
      );
      if (data) {
        const newBookList = _myList ?? {};
        newBookList[bookId] = data;
        myList.set(newBookList);
      }
    } catch (e) {
      console.error(e);
    }
  }
};
