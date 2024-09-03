import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery-item a', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.8,
});

import { requestFetch } from './js/pixabay-api';
import { createGallery, addElToHTML, cleanElHTML } from './js/render-functions';

const form = document.querySelector('.form');
const galleryList = document.querySelector('.gallery');
const loaderSpan = document.querySelector('#load-more-loader-top');
const btn = document.querySelector('#button-load-more');
const loaderMoreSpan = document.querySelector('#load-more-loader');
const galleryListItem = document.querySelector('.gallery-item');

let page = 1;
let perPage = 15;
let inputValue = '';

form.addEventListener('submit', event => {
  event.preventDefault();

  inputValue = form.elements.user_query.value.trim();

  cleanElHTML(galleryList);
  loaderSpan.classList.add('loader');

  const asyncTryCatch = async () => {
    try {
      const inf = await requestFetch(inputValue, page, perPage);
      if (inf.total === 0) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
        btn.classList.add('button-load-more');
      }
      const gallery = inf.hits
        .map(imgInform => createGallery(imgInform))
        .join('');

      addElToHTML(gallery, galleryList);

      lightbox.refresh();
      loaderSpan.classList.remove('loader');
    } catch (error) {
      iziToast.error({
        message: `Oops! Something went wrong. Erorr: ${error}`,
      });
    }
  };
  asyncTryCatch();
  btn.classList.add('button-load-more');
  loaderMoreSpan.classList.remove('loader');
  const heightItem = galleryListItem.getBoundingClientRect().height;
  scrollBy({
    top: heightItem * 2,
    behavior: 'smooth',
  });
});

btn.addEventListener('click', async () => {
  btn.classList.remove('button-load-more');

  if (inputValue === '') {
    iziToast.error({
      message: 'Please enter a subject for the photo',
    });
    return;
  }

  loaderMoreSpan.classList.add('loader');
  inputValue = form.elements.user_query.value.trim();

  try {
    page += 1;
    const inf = await requestFetch(inputValue, page, perPage);

    const gallery = inf.hits
      .map(imgInform => createGallery(imgInform))
      .join('');

    const totalPages = Math.ceil(inf.total / perPage);
    if (page > totalPages) {
      loaderMoreSpan.classList.remove('loader');

      return iziToast.error({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    galleryList.insertAdjacentHTML('beforeend', gallery);
    loaderMoreSpan.classList.remove('loader');

    lightbox.refresh();
  } catch (error) {
    iziToast.error({
      message: `Oops! Something went wrong. Erorr: ${error}`,
    });
  }

  btn.classList.add('button-load-more');
});
