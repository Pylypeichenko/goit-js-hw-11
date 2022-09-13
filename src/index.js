import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.js-search-form'),
  gallery: document.querySelector('.js-gallery'),
  loadMoreBtn: document.querySelector('.js-load-more'),
};

const axios = require('axios');

class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 100;
  }

  fetchImages() {
    const API_KEY = '29852735-acc344f41552f923d8dc8cb55';
    const BASIC_URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;
    const options = {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    };
    const urlOptions = `&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${this.page}&per_page=${this.per_page}`;

    const query = this.searchQuery.trim();
    const url = BASIC_URL + query + urlOptions;

    return axios.get(url).then(response => {
      this.pageIncrement();
      console.log(response);

      return response;
    });
  }

  pageReset() {
    this.page = 1;
  }

  pageIncrement() {
    this.page += 1;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get query() {
    return this.searchQuery;
  }
}

const imagesService = new ImagesApiService();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', addSomeImages);

function onSearch(event) {
  event.preventDefault();

  imagesService.searchQuery = event.currentTarget.elements.searchQuery.value;
  if (imagesService.searchQuery.trim() === '') {
    Notify.info('Come on, type something :)');
    return;
  }

  imagesService.pageReset();
  console.log(imagesService.fetchImages());
  imagesService
    .fetchImages()
    .then(dataObject => {
      return createImagesMarkup(dataObject);
    })
    .then(markup => {
      clearImageGallery();
      addImagesToGallery(markup);
      if (markup) {
        refs.loadMoreBtn.classList.remove('visually-hidden');
      }
    })
    .catch(onError);
}

function addSomeImages() {
  imagesService
    .fetchImages()
    .then(dataObject => {
      console.log(imagesService.page);
      if (
        imagesService.per_page * imagesService.page >
        dataObject.data.totalHits
      ) {
        onEndOfCOlletion();
      }

      return createImagesMarkup(dataObject);
    })
    .then(markup => addImagesToGallery(markup));
}

function createImagesMarkup(dataObject) {
  const images = dataObject.data.hits;

  if (images.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  const markup = images
    .map(
      image => `<div class="photo-card">
      <img class='image' src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes ${image.likes}</b>
        </p>
        <p class="info-item">
          <b>Views ${image.views}</b>
        </p>
        <p class="info-item">
          <b>Comments ${image.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads ${image.downloads}</b>
        </p>
      </div>
    </div>`
    )
    .join('');

  return markup;
}

function addImagesToGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearImageGallery() {
  refs.gallery.innerHTML = '';
}

function onEndOfCOlletion() {
  refs.loadMoreBtn.classList.add('visually-hidden');
  Notify.info(
    "We're sorry, but these are the last ones. You've reached the end of search results."
  );
}

function onError(error) {
  console.log(error);
}
