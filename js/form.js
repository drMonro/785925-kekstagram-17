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
  var imageEditorCloseElement = imageUploadForm.querySelector('.img-upload__cancel');
  var commentInputFocusStatus = false;
  var tagInputFocusStatus = false;


  var onEditFormCloseElementClick = function () {
    imageEditorOverlay.classList.add('hidden');
    imageUploadForm.reset();
    document.removeEventListener('click', onEditFormCloseElementClick);
  };

  var onEditFormEscPress = function (evt) {
    var closingKeyCode = window.utils.ESC_KEY_CODE;
    if (evt.keyCode === closingKeyCode && !commentInputFocusStatus && !tagInputFocusStatus) {
      imageEditorOverlay.classList.add('hidden');
      imageUploadForm.reset();
      document.removeEventListener('keydown', onEditFormEscPress);
    }
    return;
  };

  var addValidationHashTags = function () {
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
  };

  var getValidationHashTagsErrorMessage = function (hashTags, i) {
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
  };

  var addValidationComments = function () {
    var message = '';
    if (commentsInput.value.length > 140) {
      message = 'Максимальная длина комментария 140 символов';
    }
    return commentsInput.setCustomValidity(message);
  };

  var onSuccess = function () {
    closeImageEditForm();
    imageEditorForm.reset();
    showUploadStatusMessage('success');
    var successButton = document.querySelector('.success__button');
    mainContainer.addEventListener('click', onSuccessWindowOutsideCLick);
    successButton.addEventListener('click', removeWindowSuccessUpload);
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
    mainContainer.appendChild(messageTemplate);
  };
  var isClickOutside = function (evt, cssSelector) {
    var target = evt.target;
    var element = target.closest(cssSelector);

    return !element;
  };

  var onSuccessWindowOutsideCLick = function (evt) {
    if (isClickOutside(evt, '.success__inner')) {
      removeWindowSuccessUpload();
    }
    mainContainer.removeEventListener('click', onSuccessWindowOutsideCLick);
  };

  var removeWindowSuccessUpload = function () {
    var successMessage = document.querySelector('.success');

    successMessage.remove();

    mainContainer.removeEventListener('click', onSuccessWindowOutsideCLick);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  };

  var onSuccessMessageEscPress = function (evt) {
    window.utils.isEscEvent(evt, removeWindowSuccessUpload);
  };

  var onError = function () {
    closeImageEditForm();
    showUploadStatusMessage('error');
    var errorButtons = document.querySelector('.error__buttons');
    var cancelButton = errorButtons.querySelector('.error__button:last-child');
    var retryButton = errorButtons.querySelector('.error__button:first-child');
    var errorOverlay = document.querySelector('.error');

    mainContainer.addEventListener('click', onErrorWindowOutsideCLick);
    document.addEventListener('keydown', onErrorMessageEscPress);
    cancelButton.addEventListener('click', function () {
      errorOverlay.remove();
      imageEditorForm.reset();
    });
    retryButton.addEventListener('click', function () {
      window.utils.showHiddenBlock(imageEditorOverlay);
      errorOverlay.remove();
    });
  };

  var onErrorMessageEscPress = function (evt) {
    window.utils.isEscEvent(evt, removeWindowErrorUpload);
    imageEditorForm.reset();
  };

  var onErrorWindowOutsideCLick = function (evt) {
    if (isClickOutside(evt, '.error__inner')) {
      removeWindowErrorUpload();
      imageEditorForm.reset();
      mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
    }

    mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
  };

  var removeWindowErrorUpload = function () {
    var errorMessage = document.querySelector('.error');

    errorMessage.remove();
    mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  };


  uploadFileInput.addEventListener('change', function (evt) {
    var fileName = evt.target.value.toLowerCase();
    var file = uploadFileInput.files[0];


    var fileFormatMatches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (!fileFormatMatches) {
      return false;
    } else {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        window.preview.imgPreviewElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }

    window.preview.resetFilters();
    window.utils.showHiddenBlock(imageEditorOverlay);
    imageEditorCloseElement.addEventListener('click', onEditFormCloseElementClick);
    document.addEventListener('keydown', onEditFormEscPress);

    return true;
  });

  hashTagsInput.addEventListener('focus', function () {
    tagInputFocusStatus = true;
  });

  hashTagsInput.addEventListener('focusout', function () {
    tagInputFocusStatus = false;
  });

  hashTagsInput.addEventListener('input', function () {
    addValidationHashTags();
  });

  commentsInput.addEventListener('focus', function () {
    commentInputFocusStatus = true;
  });

  commentsInput.addEventListener('focusout', function () {
    commentInputFocusStatus = false;
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
