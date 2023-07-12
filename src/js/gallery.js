import itemTemplate from '../templates/itemTemplate.hbs';

function clearContent(elem) {
  elem.innerHTML = '';
}

function creatGalleryItems(items) {
  const markup = itemTemplate(items);
  return markup;
}

function markupContent(markup, elem) {
  elem.insertAdjacentHTML('beforeend', markup);
}

export default { clearContent, creatGalleryItems, markupContent };
