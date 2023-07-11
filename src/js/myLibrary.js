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

if (!queueArr.length && !watchArr.length) {
  refs.empty.classList.toggle('is-hidden');
  refs.gallery.classList.add('is-hidden');
}

if (refs.filter.children.watched.hasAttribute('checked')) {
  if (watchArr.length) {
    //render gallery
    refs.empty.style.display = 'none';
    renderApi.clearContent(refs.gallery);
    refs.preloaderElem.classList.toggle('is-hidden');
    refs.gallery.classList.remove('is-hidden');
    renderContent(watchArr);
  }
}

if (refs.filter.children.queue.hasAttribute('checked')) {
  if (queueArr.length) {
    //render gallery
    refs.empty.style.display = 'none';
    renderApi.clearContent(refs.gallery);
    refs.preloaderElem.classList.toggle('is-hidden');
    refs.gallery.classList.remove('is-hidden');
    renderContent(queueArr);
  }
}

function renderContent(content) {
  const markup = renderApi.creatGalleryItems(content);
  renderApi.makeupContent(markup, refs.gallery);
}
