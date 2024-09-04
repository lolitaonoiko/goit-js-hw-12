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
const btn = document.querySelector('.gallery + button');

const loaderMoreSpan = document.querySelector('#load-more-loader');

let page = 1;
let perPage = 15;
let inputValue = '';
let firstSubmit = true;

form.addEventListener('submit', async event => {
  if (!firstSubmit) {
    btn.classList.remove('js-button');
  }
  event.preventDefault();

  inputValue = form.elements.user_query.value.trim();

  page = 1;

  cleanElHTML(galleryList);
  loaderSpan.classList.add('loader');

  try {
    const inf = await requestFetch(inputValue, page, perPage);

    if (inf.totalHits === 0) {
      loaderSpan.classList.remove('loader');

      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    if (inf.totalHits <= perPage) {
      console.log(inf.totalHits);
      console.log(perPage);

      btn.classList.remove('js-button');
    }
    const gallery = inf.hits
      .map(imgInform => createGallery(imgInform))
      .join('');

    addElToHTML(gallery, galleryList);

    lightbox.refresh();

    loaderSpan.classList.remove('loader');
    btn.classList.add('js-button');
  } catch (error) {
    loaderSpan.classList.remove('loader');

    iziToast.error({
      message: `Oops! Something went wrong. ${error}`,
    });
  }

  loaderMoreSpan.classList.remove('loader');

  firstSubmit = false;
});

btn.addEventListener('click', async () => {
  btn.classList.remove('js-button');
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

    const galleryListItem = document.querySelector('.gallery-item');
    const heightOfGalleryItem = galleryListItem.getBoundingClientRect().height;

    const totalPages = Math.ceil(inf.totalHits / perPage);
    if (page > totalPages) {
      loaderMoreSpan.classList.remove('loader');
      btn.classList.remove('js-button');

      return iziToast.error({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    galleryList.insertAdjacentHTML('beforeend', gallery);

    loaderMoreSpan.classList.remove('loader');
    btn.classList.add('js-button');

    lightbox.refresh();
    scrollBy({
      top: heightOfGalleryItem * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    iziToast.error({
      message: `Oops! Something went wrong. Erorr: ${error}`,
    });
  }
});
