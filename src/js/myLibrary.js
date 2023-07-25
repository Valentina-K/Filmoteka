import { auth, onAuthStateChanged, logout } from './auth';
import storage from './storage';
import renderApi from './gallery';
import renderModal from './modal';
import { addMovie, getWatchMovies, getQueueMovies, deleteMovie } from './dbApi';

const KEY_QUEUE = 'queue';
const KEY_WATCHED = 'watched';
const queueArr = storage.load(KEY_QUEUE) ?? [];
const watchArr = storage.load(KEY_WATCHED) ?? [];
const queryQ = [];
const queryW = [];

onAuthStateChanged(auth, user => {
  if (user) {
    refs.btnLogout.style.display = 'inline-block';
    getQueueMovies(user.uid).then(data => queryQ.push(data));
    getWatchMovies(user.uid).then(data => queryW.push(data));
  } else {
    refs.btnLogout.style.display = 'none';
    goUrlJs('./index.html');
  }
});

function goUrlJs(e) {
  location.href = e;
}
const refs = {
  empty: document.querySelector('.empty'),
  gallery: document.querySelector('.js-gallery'),
  galleryItem: document.querySelector('.gallery'),
  filter: document.querySelector('.filter-thumb'),
  preloaderElem: document.querySelector('.preloader'),
  modal: document.querySelector('[data-modal]'),
  modalElem: document.querySelector('.modal-content'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  btnLogout: document.querySelector('.btnLogout'),
};

let movie;
let isWatch = true;
refs.gallery.style.overflowY = 'auto';
refs.closeModalBtn.addEventListener('click', onClose);
refs.galleryItem.addEventListener('click', onChooseMovie);
refs.modalElem.addEventListener('click', onAddOrRemove);
refs.btnLogout.addEventListener('click', onLogout);
window.addEventListener('keydown', onEscKeyPress);
const filterBtns = refs.filter.querySelectorAll('.filter');
for (const radio of filterBtns) {
  radio.addEventListener('change', onChangeFilter);
}

if (watchArr.length) {
  //render gallery
  refs.empty.style.display = 'none';
  renderApi.clearContent(refs.gallery);
  refs.preloaderElem.classList.toggle('is-hidden');
  refs.gallery.classList.remove('is-hidden');
  renderContent(watchArr);
  refs.preloaderElem.classList.toggle('is-hidden');
} else {
  refs.empty.classList.toggle('is-hidden');
  refs.gallery.classList.add('is-hidden');
}

function onLogout() {
  logout();
  //refs.btnLogout.style.display = 'none';
}

function onEscKeyPress(even) {
  if (even.code === 'Escape') {
    if (!refs.modal.classList.contains('is-hidden')) {
      toggleModal();
    }
  }
}

function renderContent(content) {
  const markup = renderApi.creatGalleryItems(content);
  renderApi.markupContent(markup, refs.gallery);
}

function onChangeFilter(evt) {
  if (Number(evt.target.value) === 1) {
    if (watchArr.length) {
      //render gallery
      isWatch = true;
      refs.empty.style.display = 'none';
      renderApi.clearContent(refs.gallery);
      refs.preloaderElem.classList.toggle('is-hidden');
      refs.gallery.classList.remove('is-hidden');
      renderContent(watchArr);
      refs.preloaderElem.classList.toggle('is-hidden');
    }
  } else {
    if (queueArr.length) {
      //render gallery
      isWatch = false;
      refs.empty.style.display = 'none';
      renderApi.clearContent(refs.gallery);
      refs.preloaderElem.classList.toggle('is-hidden');
      refs.gallery.classList.remove('is-hidden');
      renderContent(queueArr);
      refs.preloaderElem.classList.toggle('is-hidden');
    }
  }
}

function onClose() {
  toggleModal();
  renderApi.clearContent(refs.gallery);
  console.log('isWatch = ', isWatch);
  if (isWatch) renderContent(watchArr);
  else renderContent(queueArr);
}

function onChooseMovie(evt) {
  movie =
    queueArr.find(item => item.id === Number(evt.target.id)) ??
    watchArr.find(item => item.id === Number(evt.target.id));
  renderModal.prepareModalContent(refs.modalElem, movie);
  renderModal.renderModalBtns(
    queueArr,
    watchArr,
    refs.modalElem,
    Number(evt.target.id)
  );
  toggleModal();
}

function toggleModal() {
  refs.modal.classList.toggle('is-hidden');
}

function onAddOrRemove(evt) {
  const btns = evt.target.parentElement;
  const btn = btns.children;
  if (evt.target.classList.contains('queue')) {
    if (evt.target.classList.contains('remove')) {
      const index = queueArr.indexOf(movie);
      queueArr.splice(index, 1);
      storage.save(KEY_QUEUE, queueArr);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Add to queue';
      btn[0].removeAttribute('disabled');
    } else {
      movie.isQueue = true;
      movie.isWatch = false;
      queueArr.push(movie);
      storage.save(KEY_QUEUE, queueArr);
      addMovie(movie);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Remove from queue';
      btn[0].setAttribute('disabled', 'disabled');
    }
  }
  if (evt.target.classList.contains('watched')) {
    if (evt.target.classList.contains('remove')) {
      const index = watchArr.indexOf(movie);
      watchArr.splice(index, 1);
      storage.save(KEY_WATCHED, watchArr);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Add to watched';
      btn[1].removeAttribute('disabled');
    } else {
      movie.isWatch = true;
      movie.isQueue = false;
      watchArr.push(movie);
      storage.save(KEY_WATCHED, watchArr);
      addMovie(movie);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Remove from watched';
      btn[1].setAttribute('disabled', 'disabled');
    }
  }
}
