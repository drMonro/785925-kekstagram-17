'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var SPACE_BAR_KEY_CODE = 32;
  var imageEditorForm = document.querySelector('.img-upload__overlay');
  var elementPopupClose = document.getElementById('upload-cancel');
  var uploadWindow = document.querySelector('.img-upload');
  var commentInputFocusStatus = false;
  var tagInputFocusStatus = false;
  var commentInput = uploadWindow.querySelector('.text__description');
  var uploadFileArea = document.getElementById('upload-file');
  var hashTagsInput = imageEditorForm.querySelector('.text__hashtags');


  function onHashTagsInputValidation() {
    var hashTags = hashTagsInput.value
      .split(' ')
      .map(function (hashTag) {
        return hashTag.toLowerCase();
      });

    var message = '';

    if (hashTags.length > 5) {
      message = 'Нельзя указать больше пяти хэш-тегов';
    } else {
      for (var i = 0; i < hashTags.length; i++) {
        message = validationHashTag(hashTags, i);
        if (message) {
          break;
        }
      }
    }

    hashTagsInput.setCustomValidity(message);
  }

  function validationHashTag(hashTags, i) {
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


  var openImageEditorPopup = function (imageEditor, closingKeyCode) {
    imageEditor.classList.remove('hidden');
    document.addEventListener('keydown', function (evt) {
      closeOnPressKey(evt, imageEditor, closingKeyCode);
    });
  };

  var closeOnPressKey = function (evt, popup, closingKeyCode) {
    if (evt.keyCode === closingKeyCode && !commentInputFocusStatus && !tagInputFocusStatus) {
      closeImageEditorPopup(popup, closingKeyCode);
    }
  };

  var closeImageEditorPopup = function (imageEditor, closingKeyCode) {
    imageEditor.classList.add('hidden');
    document.removeEventListener('keydown', function (evt) {
      closeOnPressKey(evt, imageEditor, closingKeyCode);
    });
    window.preview.resetFilters();
  };


  uploadFileArea.addEventListener('change', function () {
    openImageEditorPopup(imageEditorForm, ESC_KEY_CODE);
  });

  elementPopupClose.addEventListener('click', function () {
    closeImageEditorPopup(imageEditorForm, ESC_KEY_CODE);
  });

  elementPopupClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === SPACE_BAR_KEY_CODE) {
      closeImageEditorPopup(imageEditorForm, ESC_KEY_CODE);
    }
  });

  commentInput.addEventListener('focus', function () {
    commentInputFocusStatus = true;
  });

  commentInput.addEventListener('focusout', function () {
    commentInputFocusStatus = false;
  });

  hashTagsInput.addEventListener('focus', function () {
    commentInputFocusStatus = true;
  });

  hashTagsInput.addEventListener('focusout', function () {
    commentInputFocusStatus = false;
  });

  hashTagsInput.addEventListener('input', onHashTagsInputValidation);


  window.form = {
    SPACE_BAR_KEY_CODE: SPACE_BAR_KEY_CODE,
    ESC_KEY_CODE: ESC_KEY_CODE,
    closeOnPressKey: closeOnPressKey
  };

})();
