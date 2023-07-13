import modalTemplate from '../templates/modalTemplate.hbs';
import player from '../templates/player.hbs';
function clearModal(elem) {
  elem.innerHTML = '';
}

function creatModalItem(items) {
  const markup = modalTemplate(items);
  return markup;
}

function markupModal(markup, elem) {
  elem.insertAdjacentHTML('beforeend', markup);
}

function prepareModalPreview(modalElem, youtubeId) {
  clearModal(modalElem);
  const markup = player(youtubeId);
  markupModal(markup, modalElem);
}

function prepareModalContent(modalElem, movie) {
  clearModal(modalElem);
  const markup = creatModalItem(movie);
  markupModal(markup, modalElem);
}

function renderModalBtns(queueArr, watchArr, modalElem, movieId) {
  if (queueArr.some(({ id }) => id === movieId)) {
    modalElem.childNodes[2].children[2].children[1].classList.add('remove');
    modalElem.childNodes[2].children[2].children[1].textContent =
      'Remove from queue';
    modalElem.childNodes[2].children[2].children[0].setAttribute(
      'disabled',
      'disabled'
    );
  }
  if (watchArr.some(({ id }) => id === movieId)) {
    modalElem.childNodes[2].children[2].children[0].classList.add('remove');
    modalElem.childNodes[2].children[2].children[0].textContent =
      'Remove from watched';
    modalElem.childNodes[2].children[2].children[1].setAttribute(
      'disabled',
      'disabled'
    );
  }
}

export default {
  clearModal,
  creatModalItem,
  markupModal,
  prepareModalContent,
  renderModalBtns,
  prepareModalPreview,
};
