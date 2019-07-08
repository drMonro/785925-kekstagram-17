'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var SPACE_BAR_KEY_CODE = 32;
  var imageEditorForm = document.querySelector('.img-upload__overlay');
  var elementPopupClose = document.getElementById('upload-cancel');
  var uploadWindow = document.querySelector('.img-upload');
  var commentInputFocusStatus = false;
  var commentInput = uploadWindow.querySelector('.text__description');
  var uploadFileArea = document.getElementById('upload-file');


  var openImageEditorPopup = function (imageEditor, closingKeyCode) {
    imageEditor.classList.remove('hidden');
    document.addEventListener('keydown', function (evt) {
      closeOnPressKey(evt, imageEditor, closingKeyCode);
    });
  };

  var closeOnPressKey = function (evt, popup, closingKeyCode) {
    if (evt.keyCode === closingKeyCode && !commentInputFocusStatus) {
      closeImageEditorPopup(popup, closingKeyCode);
    }
  };

  var closeImageEditorPopup = function (imageEditor, closingKeyCode) {
    imageEditor.classList.add('hidden');
    document.removeEventListener('keydown', function (evt) {
      closeOnPressKey(evt, imageEditor, closingKeyCode);
    });
    window.preview.resetFilters();
    // clearForm();
  };

  // var clearForm = function () {
  //   uploadFileArea.value = '';
  // };


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


  window.form = {
    SPACE_BAR_KEY_CODE: SPACE_BAR_KEY_CODE,
    ESC_KEY_CODE: ESC_KEY_CODE,
    closeOnPressKey: closeOnPressKey
  };

})();
