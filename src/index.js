import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const API_KEY = '29852735-acc344f41552f923d8dc8cb55';
const BASIC_URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;
const options = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};
const urlOptions = `&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}`;
let query = 'car';
const url = BASIC_URL + query + urlOptions;

const axios = require('axios');

axios.get(url).then(res => res.json);
