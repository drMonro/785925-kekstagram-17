'use strict';

(function () {
  var imageEditorOverlay = document.querySelector('.img-upload__overlay');
  var imageEditorForm = document.querySelector('.img-upload__form');
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var mainContainer = document.querySelector('main');
  var imageUploadForm = document.querySelector('.img-upload__form');
  var uploadFileInput = imageUploadForm.querySelector('#upload-file');
  var hashTagsInput = imageUploadForm.querySelector('.text__hashtags');
  var commentsInput = imageUploadForm.querySelector('.text__description');


  function addValidationHashTags() {
    var hashTags = hashTagsInput.value
      .split(' ')
      .map(function (hashTag) {
        return hashTag.toLowerCase();
      });

    var message = '';

    if (hashTags.length === 0) {
      message = '';
    } else if (hashTags.length === 5) {
      message = 'Нельзя указать больше пяти хэш-тегов';
    } else {
      for (var i = 0; i < hashTags.length; i++) {
        message = getValidationHashTagsErrorMessage(hashTags, i);
        if (message) {
          break;
        }
      }
    }

    hashTagsInput.setCustomValidity(message);
  }

  function getValidationHashTagsErrorMessage(hashTags, i) {
    var message = '';
    if (hashTags[i].charAt(0) === '') {
      message = '';

    } else if (hashTags[i].charAt(0) !== '#') {
      message = 'Хеш-теги должны начинаться с "#"';

    } else if (hashTags[i].length === 1) {
      message = 'Хеш-теги должны состоять хотя бы из одного символа';

    } else if (hashTags[i].indexOf('#', 1) > 0) {
      message = 'Хеш-теги должны разделяться пробелами';

    } else if (hashTags.indexOf(hashTags[i], i + 1) > 0) {
      message = 'Один и тот же хэш-тег не может быть использован дважды';

    } else if (hashTags[i].length > 20) {
      message = 'Максимальная длина одного хэш-тега 20 символов';
    }
    return message;
  }

  function onSuccess() {
    window.utils.closePopup(imageEditorOverlay);
    imageEditorForm.reset();
    showUploadStatusMessage('success');
    var successButton = document.querySelector('.success__button');
    var successOverlay = document.querySelector('.success');
    successButton.addEventListener('click', function () {
      successOverlay.remove();
    });
    successOverlay.addEventListener('click', function () {
      successOverlay.remove();
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.ESC_KEY_CODE) {
        successOverlay.remove();
      }
    });
  }

  function onError() {
    window.utils.closePopup(imageEditorOverlay);
    showUploadStatusMessage('error');
    var errorButtons = document.querySelector('.error__buttons');
    var cancelButton = errorButtons.querySelector('.error__button:last-child');
    var retryButton = errorButtons.querySelector('.error__button:first-child');
    var errorOverlay = document.querySelector('.error');

    cancelButton.addEventListener('click', function () {
      errorOverlay.remove();
      imageEditorForm.reset();
    });

    retryButton.addEventListener('click', function () {
      window.utils.openPopup(imageEditorOverlay);
      errorOverlay.remove();
    });
  }

  function showUploadStatusMessage(classNameMessage) {
    var messageTemplate = document.querySelector('#' + classNameMessage)
      .content.querySelector('.' + classNameMessage)
      .cloneNode(true);
    mainContainer.appendChild(messageTemplate);
  }

  function addValidationComments() {

    var message = '';

    if (commentsInput.value.length > 140) {
      message = 'Максимальная длина комментария 140 символов';
    }

    return commentsInput.setCustomValidity(message);
  }

  uploadFileInput.addEventListener('change', function (evt) {
    var fileName = evt.target.value.toLowerCase();

    var fileFormatMatches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (!fileFormatMatches) {
      return false;
    }

    window.preview.resetFilters();
    window.utils.openPopup(imageEditorOverlay);
    return true;
  });


  hashTagsInput.addEventListener('input', function () {
    addValidationHashTags();
  });

  commentsInput.addEventListener('input', function () {
    addValidationComments();
  });

  imageUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var data = new FormData(imageUploadForm);
    window.backend.save(data, onSuccess, onError);

  });


  window.form = {
    commentsInput: commentsInput,
    hashTagsInput: hashTagsInput,
    imageEditorForm: imageEditorForm,
  };

})();
