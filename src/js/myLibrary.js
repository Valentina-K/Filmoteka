import storage from './storage';
import renderApi from './gallery';
const KEY_QUEUE = 'queue';
const KEY_WATCHED = 'watched';
const queueArr = storage.load(KEY_QUEUE) ?? [];
const watchArr = storage.load(KEY_WATCHED) ?? [];

const refs = {
  empty: document.querySelector('.empty'),
  gallery: document.querySelector('.js-gallery'),
  galleryItem: document.querySelector('.gallery'),
  filter: document.querySelector('.filter-thumb'),
  preloaderElem: document.querySelector('.preloader'),
};
refs.gallery.style.overflowY = 'auto';
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

function renderContent(content) {
  const markup = renderApi.creatGalleryItems(content);
  renderApi.markupContent(markup, refs.gallery);
}

function onChangeFilter(evt) {
  if (Number(evt.target.value) === 1) {
    if (watchArr.length) {
      //render gallery
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
      refs.empty.style.display = 'none';
      renderApi.clearContent(refs.gallery);
      refs.preloaderElem.classList.toggle('is-hidden');
      refs.gallery.classList.remove('is-hidden');
      renderContent(queueArr);
      refs.preloaderElem.classList.toggle('is-hidden');
    }
  }
}
