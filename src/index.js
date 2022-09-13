import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const axios = require('axios');

class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const API_KEY = '29852735-acc344f41552f923d8dc8cb55';
    const BASIC_URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;
    const options = {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    };
    const urlOptions = `&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${this.page}`;

    const query = this.searchQuery;
    const url = BASIC_URL + query + urlOptions;

    if (query === '') {
      return;
    }

    return axios
      .get(url)
      .then(response => {
        console.log(response.data.hits);
        return response.data.hits;
      })
      .then(() => {
        this.pageIncrement();
      })
      .catch(error => {
        console.log(error);
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
  imagesService.pageReset();
  imagesService.fetchImages().then(images => {
    console.log(images);
  });
}

function addSomeImages() {
  imagesService.fetchImages();
}

// `<div class="photo-card">
//       <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
//       <div class="info">
//         <p class="info-item">
//           <b>Likes ${image.likes}</b>
//         </p>
//         <p class="info-item">
//           <b>Views ${image.views}</b>
//         </p>
//         <p class="info-item">
//           <b>Comments ${image.comments}</b>
//         </p>
//         <p class="info-item">
//           <b>Downloads ${image.downloads}</b>
//         </p>
//       </div>
//     </div>`
