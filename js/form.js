'use strict';

(function () {
  var imageEditorOverlay = document.querySelector('.img-upload__overlay');
  var imageEditorForm = document.querySelector('.img-upload__form');
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var mainContainer = document.querySelector('main');
  var imageUploadForm = document.querySelector('.img-upload__form');
  var uploadFileInput = imageUploadForm.querySelector('#upload-file');
  var hashTagsInput = imageUploadForm.querySelector('.text__hashtags');
  var commentInput = imageUploadForm.querySelector('.text__description');


  function addValidationHashTags() {
    var hashTags = hashTagsInput.value
      .split(' ')
      .map(function (hashTag) {
        return hashTag.toLowerCase();
      });

    var message = '';

    if (hashTagsInput.value.length === 0) {
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
    if (hashTags[i].charAt(0) !== '#') {
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
    showUploadStatusMessage('success');
    var successButton = document.querySelector('.success__button');
    var successOverlay = document.querySelector('.success');
    successButton.addEventListener('click', function () {
      successOverlay.remove();
    });
  }

  function onError() {
    window.utils.closePopup(imageEditorOverlay);
    showUploadStatusMessage('error');
    var errorButtons = document.querySelectorAll('.error__button');
    var errorOverlay = document.querySelector('.error');

    errorButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        errorOverlay.remove();
      });
    });
  }

  function showUploadStatusMessage(classNameMessage) {
    var messageTemplate = document.querySelector('#' + classNameMessage)
      .content.querySelector('.' + classNameMessage)
      .cloneNode(true);
    mainContainer.appendChild(messageTemplate);
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

  imageUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var data = new FormData(imageUploadForm);
    window.backend.save(data, onSuccess, onError);
    imageEditorForm.reset();

  });


  window.form = {
    commentInput: commentInput,
    hashTagsInput: hashTagsInput,
    imageEditorForm: imageEditorForm,
  };

})();
