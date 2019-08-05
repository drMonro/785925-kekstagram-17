'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MAX_COMMENTS_LENGTH = 140;

  var imageEditorOverlay = document.querySelector('.img-upload__overlay');
  var imageUploadForm = document.querySelector('.img-upload__form');
  var uploadFileInput = imageUploadForm.querySelector('#upload-file');
  var imageEditorCloseElement = imageUploadForm.querySelector('.img-upload__cancel');


  var onEditFormCloseElementClick = function () {
    closeImageEditForm();
    imageUploadForm.reset();
  };

  var onEditFormEscPress = function (evt) {
    window.utils.invokeIfEscEvent(evt, onEditFormCloseElementClick);
  };

  var addValidationHashTags = function () {
    var hashTags = window.utils.hashTagsInput.value
      .split(' ')
      .map(function (hashTag) {
        return hashTag.toLowerCase();
      });
    var message = '';

    if (hashTags.length === 0) {
      message = '';
    } else if (hashTags.length > 5) {
      message = 'Нельзя указать больше пяти хэш-тегов';
    } else {
      hashTags.forEach(function (tag, index) {
        message = getValidationHashTagsErrorMessage(hashTags, index);
        if (message) {
          return;
        }
      });
    }
    window.utils.hashTagsInput.setCustomValidity(message);
  };

  var getValidationHashTagsErrorMessage = function (hashTags, i) {
    var UniqueHashTags = [];
    var message = '';

    if (UniqueHashTags.indexOf(hashTags[i]) === -1) {
      UniqueHashTags.push(hashTags[i]);
    }

    if (hashTags[i].charAt(0) === '') {
      message = '';
    } else if (hashTags[i].charAt(0) !== '#') {
      message = 'Хеш-теги должны начинаться с "#"';
    } else if (hashTags[i].length === 1) {
      message = 'Хеш-теги должны состоять хотя бы из одного символа';
    } else if (hashTags[i].indexOf('#', 1) > 0) {
      message = 'Хеш-теги должны разделяться пробелами';
    } else if (UniqueHashTags[i] !== hashTags[i]) {
      message = 'Один и тот же хэш-тег не может быть использован дважды';
    } else if (hashTags[i].length > 20) {
      message = 'Максимальная длина одного хэш-тега 20 символов';
    }
    return message;
  };

  var addValidationComments = function (maxLength) {
    var message = '';
    if (window.utils.commentsInput.value.length > maxLength) {
      message = 'Максимальная длина комментария 140 символов';
    }
    return window.utils.commentsInput.setCustomValidity(message);
  };

  var onSuccess = function () {
    closeImageEditForm();
    // imageUploadForm.reset();
    showUploadStatusMessage('success');
    var successButton = document.querySelector('.success__button');
    window.utils.mainContainer.addEventListener('click', onSuccessWindowOutsideCLick);
    successButton.addEventListener('click', onSuccessButtonClick);
    document.addEventListener('keydown', onSuccessMessageEscPress);
  };

  var closeImageEditForm = function () {
    imageEditorOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEditFormEscPress);
  };

  var showUploadStatusMessage = function (classNameMessage) {
    var messageTemplate = document.querySelector('#' + classNameMessage)
      .content.querySelector('.' + classNameMessage)
      .cloneNode(true);
    window.utils.mainContainer.appendChild(messageTemplate);
  };

  var isClickOutside = function (evt, cssSelector) {
    var target = evt.target;
    var element = target.closest(cssSelector);
    return !element;
  };

  var onSuccessWindowOutsideCLick = function (evt) {
    if (isClickOutside(evt, '.success__inner')) {
      onSuccessButtonClick();
    }
    window.utils.mainContainer.removeEventListener('click', onSuccessWindowOutsideCLick);
  };

  var onSuccessButtonClick = function () {
    var successMessage = document.querySelector('.success');
    successMessage.remove();
    window.utils.mainContainer.removeEventListener('click', onSuccessWindowOutsideCLick);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  };

  var onSuccessMessageEscPress = function (evt) {
    window.utils.invokeIfEscEvent(evt, onSuccessButtonClick);
  };

  var onError = function () {
    closeImageEditForm();
    showUploadStatusMessage('error');
    var errorButtons = document.querySelector('.error__buttons');
    var cancelButton = errorButtons.querySelector('.error__button:last-child');
    var retryButton = errorButtons.querySelector('.error__button:first-child');
    var errorOverlay = document.querySelector('.error');

    window.utils.mainContainer.addEventListener('click', onErrorWindowOutsideCLick);
    document.addEventListener('keydown', onErrorMessageEscPress);
    cancelButton.addEventListener('click', function () {
      errorOverlay.remove();
      imageUploadForm.reset();
    });
    retryButton.addEventListener('click', function () {
      window.utils.showHiddenBlock(imageEditorOverlay);
      errorOverlay.remove();
      document.removeEventListener('keydown', onErrorMessageEscPress);
    });
  };

  var onErrorMessageEscPress = function (evt) {
    window.utils.invokeIfEscEvent(evt, removeWindowErrorUpload);
    imageUploadForm.reset();
  };

  var onErrorWindowOutsideCLick = function (evt) {
    if (isClickOutside(evt, '.error__inner')) {
      removeWindowErrorUpload();
      imageUploadForm.reset();
      window.utils.mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
    }

    window.utils.mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
  };

  var removeWindowErrorUpload = function () {
    var errorMessage = document.querySelector('.error');

    errorMessage.remove();
    window.utils.mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  };


  uploadFileInput.addEventListener('change', function (evt) {
    var fileName = evt.target.value.toLowerCase();
    var file = uploadFileInput.files[0];


    var fileFormatMatches = FILE_TYPES.some(function (fileType) {
      return fileName.endsWith(fileType);
    });

    if (!fileFormatMatches) {
      return false;
    }

    var reader = new FileReader();
    reader.addEventListener('load', function () {
      window.preview.imageElement.src = reader.result;
    });
    reader.readAsDataURL(file);

    window.preview.resetFilters();
    window.utils.showHiddenBlock(imageEditorOverlay);
    imageEditorCloseElement.addEventListener('click', onEditFormCloseElementClick);
    document.addEventListener('keydown', onEditFormEscPress);

    return true;
  });

  window.utils.hashTagsInput.addEventListener('change', function () {
    addValidationHashTags();
  });

  window.utils.commentsInput.addEventListener('change', function () {
    addValidationComments(MAX_COMMENTS_LENGTH);
  });

  imageUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var data = new FormData(imageUploadForm);
    window.backend.save(data, onSuccess, onError, window.backend.SAVE_URL);
  });

})();
