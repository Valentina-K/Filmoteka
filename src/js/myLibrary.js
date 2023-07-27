import { auth, onAuthStateChanged, logout } from './auth';
import renderApi from './gallery';
import renderModal from './modal';
import { addMovie, getWatchMovies, getQueueMovies, deleteMovie } from './dbApi';

let queryQ = [];
let queryW = [];

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
  play: document.querySelector('.play'),
};

let movie;
let isWatch = true;
refs.gallery.style.overflowY = 'auto';
refs.closeModalBtn.addEventListener('click', onClose);
refs.galleryItem.addEventListener('click', onChooseMovie);
refs.modalElem.addEventListener('click', onAddOrRemove);
refs.btnLogout.addEventListener('click', onLogout);
refs.play.addEventListener('click', onPlay);
window.addEventListener('keydown', onEscKeyPress);
const filterBtns = refs.filter.querySelectorAll('.filter');
for (const radio of filterBtns) {
  radio.addEventListener('change', onChangeFilter);
}

onAuthStateChanged(auth, user => {
  if (user) {
    renderApi.clearContent(refs.gallery);
    refs.btnLogout.style.display = 'inline-block';
    getQueueMovies(user.uid).then(data => (queryQ = data));
    getWatchMovies(user.uid).then(data => {
      if (data.length) {
        //render gallery
        refs.empty.style.display = 'none';
        refs.preloaderElem.classList.toggle('is-hidden');
        refs.gallery.classList.remove('is-hidden');
        renderContent(data);
        refs.preloaderElem.classList.toggle('is-hidden');
      } else {
        refs.empty.style.display = 'block';
        refs.gallery.classList.add('is-hidden');
      }
      queryW = data;
    });
  } else {
    refs.btnLogout.style.display = 'none';
    location.href = './index.html';
  }
});

function onLogout() {
  logout();
}

function onEscKeyPress(even) {
  if (even.code === 'Escape') {
    if (!refs.modal.classList.contains('is-hidden')) {
      toggleModal();
    }
  }
}

function onPlay() {
  const player = new Plyr('#player', {});
  // Expose player so it can be used from the console
  refs.play.style.display = 'none';
  renderModal.prepareModalPreview(refs.modalElem, movie.youtubeId);
  window.player = player;
}

function renderContent(content) {
  const markup = renderApi.creatGalleryItems(content);
  renderApi.markupContent(markup, refs.gallery);
}

function onChangeFilter(evt) {
  renderApi.clearContent(refs.gallery);
  if (Number(evt.target.value) === 1) {
    if (queryW.length) {
      //render gallery
      isWatch = true;
      refs.empty.style.display = 'none';
      refs.preloaderElem.classList.toggle('is-hidden');
      refs.gallery.classList.remove('is-hidden');
      renderContent(queryW);
      refs.preloaderElem.classList.toggle('is-hidden');
    } else {
      refs.empty.style.display = 'block';
      refs.gallery.classList.add('is-hidden');
    }
  } else {
    if (queryQ.length) {
      //render gallery
      isWatch = false;
      refs.empty.style.display = 'none';
      refs.preloaderElem.classList.toggle('is-hidden');
      refs.gallery.classList.remove('is-hidden');
      renderContent(queryQ);
      refs.preloaderElem.classList.toggle('is-hidden');
    } else {
      refs.empty.style.display = 'block';
      refs.gallery.classList.add('is-hidden');
    }
  }
}

function onClose() {
  toggleModal();
  renderApi.clearContent(refs.gallery);
  if (isWatch) renderContent(queryW);
  else renderContent(queryQ);
}

function onChooseMovie(evt) {
  movie =
    queryQ.find(item => item.id === Number(evt.target.id)) ??
    queryW.find(item => item.id === Number(evt.target.id));
  if (movie.youtubeId !== undefined) {
    refs.play.style.display = 'block';
  } else {
    refs.play.style.display = 'none';
  }
  renderModal.prepareModalContent(refs.modalElem, movie);
  renderModal.renderModalBtns(
    queryQ,
    queryW,
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
      deleteMovie(movie.id);
      const index = queryQ.indexOf(movie);
      queryQ.splice(index, 1);
      //storage.save(KEY_QUEUE, queryQ); here is removeMovies
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Add to queue';
      btn[0].removeAttribute('disabled');
    } else {
      movie.isQueue = true;
      movie.isWatch = false;
      queryQ.push(movie);
      //storage.save(KEY_QUEUE, queryQ); here is removeMovies
      addMovie(movie);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Remove from queue';
      btn[0].setAttribute('disabled', 'disabled');
    }
    renderContent(queryQ);
  }
  if (evt.target.classList.contains('watched')) {
    if (evt.target.classList.contains('remove')) {
      deleteMovie(movie.id);
      const index = queryW.indexOf(movie);
      queryW.splice(index, 1);
      //storage.save(KEY_WATCHED, queryW); here is removeMovies
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Add to watched';
      btn[1].removeAttribute('disabled');
    } else {
      movie.isWatch = true;
      movie.isQueue = false;
      queryW.push(movie);
      //storage.save(KEY_WATCHED, queryW); here is removeMovies
      addMovie(movie);
      evt.target.classList.toggle('remove');
      evt.target.textContent = 'Remove from watched';
      btn[1].setAttribute('disabled', 'disabled');
    }
    renderContent(queryW);
  }
}
