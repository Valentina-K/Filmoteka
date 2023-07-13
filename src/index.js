import { pagination } from './js/pagination';
import renderApi from './js/gallery';
import renderModal from './js/modal';
import API from './js/api';
import storage from './js/storage';
import modal from './js/modal';

const instanceAPI = new API();

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.js-gallery'),
  galleryItem: document.querySelector('.gallery'),
  searchInput: document.querySelector('.shearch-text'),
  errorSearch: document.querySelector('.error-search-message'),
  preloaderElem: document.querySelector('.preloader'),
  paginationElem: document.querySelector('.tui-pagination'),
  modalElem: document.querySelector('.modal-content'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modal: document.querySelector('[data-modal]'),
  play: document.querySelector('.play'),
};

let movie;
const KEY_QUEUE = 'queue';
const KEY_WATCHED = 'watched';
const queueArr = storage.load(KEY_QUEUE) ?? [];
const watchArr = storage.load(KEY_WATCHED) ?? [];
window.addEventListener('load', getTrend);
window.addEventListener('keydown', onEscKeyPress);

pagination.on('beforeMove', event => {
  instanceAPI.setcurrentPage(event.page);
  prepareGallery();
  const func = instanceAPI.c_method
    ? instanceAPI.getSearchMovies
    : instanceAPI.getTrendingMovies;
  getData(func, instanceAPI.c_method);
});
refs.searchForm.addEventListener('submit', onSearch);
refs.searchInput.addEventListener('focus', onFocus);
refs.galleryItem.addEventListener('click', onClick);
refs.closeModalBtn.addEventListener('click', onClose);
refs.modalElem.addEventListener('click', onAddOrRemove);

function onAddOrRemove(evt) {
  const btns = evt.target.parentElement;
  const btn = btns.children;
  if (evt.target.classList.contains('queue')) {
    if (evt.target.classList.contains('remove')) {
      const removeFromQueue = queueArr.filter(item => item.id !== movie.id);
      storage.save(KEY_QUEUE, removeFromQueue);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Add to queue';
      btn[0].removeAttribute('disabled');
    } else {
      queueArr.push(movie);
      storage.save(KEY_QUEUE, queueArr);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Remove from queue';
      btn[0].setAttribute('disabled', 'disabled');
    }
  }
  if (evt.target.classList.contains('watched')) {
    if (evt.target.classList.contains('remove')) {
      const removeFromWatch = watchArr.filter(item => item.id !== movie.id);
      storage.save(KEY_WATCHED, removeFromWatch);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Add to watched';
      btn[1].removeAttribute('disabled');
    } else {
      watchArr.push(movie);
      storage.save(KEY_WATCHED, watchArr);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Remove from watched';
      btn[1].setAttribute('disabled', 'disabled');
    }
  }
}

function onClose() {
  toggleModal();
  //renderModal(); - only from my library
}

function onEscKeyPress(even) {
  if (even.code === 'Escape') {
    if (!refs.modal.classList.contains('is-hidden')) {
      toggleModal();
    }
  }
}

function toggleModal() {
  refs.modal.classList.toggle('is-hidden');
}

async function onClick(evt) {
  const result = await instanceAPI.getMovieByIdVideo(evt.target.id);
  const { results } = result;
  let youtubeId;
  if (results.length > 0) {
    const youtube = results.find(item => item.type === 'Trailer');
    youtubeId = youtube.id;
  }
  const response = await instanceAPI.getMovieById(evt.target.id);
  response.vote_average = response.vote_average.toFixed(1);
  response.popularity = response.popularity.toFixed(1);
  response.genres.forEach(
    (el, ind, arr) =>
      (arr[ind] =
        ind === arr.length - 1
          ? instanceAPI.getGenres(el.id)
          : instanceAPI.getGenres(el.id) + ',')
  );
  movie = { ...response, youtubeId };
  console.log(youtubeId !== undefined);
  if (youtubeId !== 'undefined') {
    refs.play.style.display = 'block';
  }
  renderModal.prepareModalContent(refs.modalElem, movie);
  renderModal.renderModalBtns(queueArr, watchArr, refs.modalElem, movie.id);
  toggleModal();
}

function onFocus(evt) {
  evt.target.value = '';
  instanceAPI.setcurrentPage(1);
  pagination.reset();
}

function onSearch(evt) {
  evt.preventDefault();
  refs.searchInput.blur();
  instanceAPI.searchQuery = evt.currentTarget.elements[0].value.trim();
  if (instanceAPI.searchQuery) {
    prepareGallery();
    getData(instanceAPI.getSearchMovies, 1);
  }
}

function getTrend() {
  prepareGallery();
  getData(instanceAPI.getTrendingMovies, 0);
}

async function getData(funct, method) {
  try {
    const response = await funct();
    pagination.setTotalItems(response.total_results);
    const data = response.results;
    if (data.length === 0) {
      refs.preloaderElem.classList.toggle('is-hidden');
      refs.errorSearch.classList.remove('is-hidden');
      refs.paginationElem.classList.add('is-hidden');
    } else {
      instanceAPI.c_method = method;
      parseData(data);
      refs.preloaderElem.classList.toggle('is-hidden');
      renderContent(data);
      refs.paginationElem.classList.remove('is-hidden');
    }
  } catch (error) {}
}

function prepareGallery() {
  renderApi.clearContent(refs.gallery);
  refs.preloaderElem.classList.toggle('is-hidden');
}

function parseData(data) {
  data.forEach((element, i) => {
    data[i].vote_average = element.vote_average.toFixed(1);
    data[i].genre_ids.forEach(
      (el, ind, arr) =>
        (arr[ind] =
          ind === arr.length - 1
            ? instanceAPI.getGenres(el)
            : instanceAPI.getGenres(el) + ',')
    );
  });
}

function renderContent(content) {
  refs.errorSearch.classList.add('is-hidden');
  const markup = renderApi.creatGalleryItems(content);
  renderApi.markupContent(markup, refs.gallery);
}
