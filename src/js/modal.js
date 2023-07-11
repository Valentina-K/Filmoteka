import modalTemplate from '../templates/modalTemplate.hbs';
function clearModal(elem) {
  elem.innerHTML = '';
}

function creatModalItem(items) {
  const markup = modalTemplate(items);
  return markup;
}

function makeupModal(markup, elem) {
  elem.insertAdjacentHTML('beforeend', markup);
}

export default {
  clearModal,
  creatModalItem,
  makeupModal,
};
