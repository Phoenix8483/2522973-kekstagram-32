import {isEscapeKey} from './util.js';
import {resetScale} from './scale.js';
import {resetEffects} from './effect.js';

const form = document.querySelector('.img-upload__form');
const fileField = document.querySelector('#upload-file');
const formUpload = document.querySelector('.img-upload__overlay');
const bodyElement = document.querySelector('body');
const cancelButton = document.querySelector('#upload-cancel');
const hashtagField = form.querySelector('.text__hashtags');
const commentField = form.querySelector('.text__description');

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAG_COUNT = 5;
const VALID_SYMBOLS = /^#[a-zа-яё0-9]{1,19}$/i;
const hashtagErrors = {
  UNVALID_HASHTAG: 'Неправильный хэштег',
  UNVALID_COUNT: `Максимум ${MAX_HASHTAG_COUNT} хештегов`,
  NOT_UNIQUE: 'Хэштеги не должны повторяться',
};
const commentErorr = 'Максимальная длина комментария 140 символов';

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper__error',
});

const showFormModal = () => {
  formUpload.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', onEscKeyDown);
};

const hideFormModal = () => {
  form.reset();
  resetScale();
  resetEffects();
  pristine.reset();
  formUpload.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeyDown);
};

function onEscKeyDown (evt) {
  if(isEscapeKey(evt)) {
    evt.preventDefault();
    hideFormModal();
  }
}

function onInputKeydownEscape (evt) {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
}

const onNewFileUpload = () => {
  showFormModal();
};

const onCancelButtonClick = () => {
  hideFormModal();
};

const onFormSubmit = (evt) => {
  if (!pristine.validate()) {
    evt.preventDefault();
  }
};

const prepareHashtags = (inputTag) => inputTag.trim().split(' ').filter((tag) => tag.length > 0);

const isHashtagsValid = (value) => prepareHashtags(value).every((tag) => VALID_SYMBOLS.test(tag));

const isHashtagsCount = (value) => prepareHashtags(value).length <= MAX_HASHTAG_COUNT;

const isHashtagUnique = (value) => {
  const lowerCaseTags = prepareHashtags(value).map((tag) => tag.toLowerCase());
  return lowerCaseTags.length === new Set(lowerCaseTags).size;
};

const isCommentLengthValid = (inputComment) => inputComment.length <= MAX_COMMENT_LENGTH;

pristine.addValidator(hashtagField, isHashtagsCount, hashtagErrors.UNVALID_COUNT, 3, true);

pristine.addValidator(hashtagField, isHashtagUnique, hashtagErrors.NOT_UNIQUE, 2, true);

pristine.addValidator(hashtagField, isHashtagsValid, hashtagErrors.UNVALID_HASHTAG, 1, true);

pristine.addValidator(commentField, isCommentLengthValid, commentErorr);

hashtagField.addEventListener('keydown', onInputKeydownEscape);
commentField.addEventListener('keydown', onInputKeydownEscape);

fileField.addEventListener('change', onNewFileUpload);
cancelButton.addEventListener('click', onCancelButtonClick);
form.addEventListener('submit', onFormSubmit);

