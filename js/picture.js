'use strict';

(function () {
  var bigPictureElement = document.querySelector('.big-picture');


  var showBigPictureForm = function (data) {
    var bigPictureCloseElement = bigPictureElement.querySelector('.big-picture__cancel');

    displayBigPicture(data);
    displayBigPictureBlock();

    bigPictureCloseElement.addEventListener('click', onCloseElementClick);
    document.addEventListener('keydown', function (evt) {
      window.form.closeOnPressKey(evt, bigPictureElement, window.form.ESC_KEY_CODE);

    });
  };

  var displayBigPicture = function (dataPhoto) {
    var comments = dataPhoto.comments;
    var image = bigPictureElement.querySelector('.big-picture__img');
    var imageSrcElement = image.querySelector('img');
    var likesCountElement = bigPictureElement.querySelector('.likes-count');
    var commentsCountElement = bigPictureElement.querySelector('.comments-count');
    var socialCaption = bigPictureElement.querySelector('.social__caption');
    var fragment = document.createDocumentFragment();
    var similarListElement = document.querySelector('.social__comments');

    comments.forEach(function (comment) {
      fragment.appendChild(createComment(comment));
    });

    clearCommentsList();

    similarListElement.appendChild(fragment);

    imageSrcElement.src = dataPhoto.url;
    likesCountElement.textContent = dataPhoto.likes;
    commentsCountElement.textContent = dataPhoto.comments.length;
    socialCaption.textContent = dataPhoto.description;
  };

  var createComment = function (comment) {
    var commentElement = bigPictureElement.querySelector('.social__comment');
    var elementDescription = commentElement.cloneNode(true);

    elementDescription.querySelector('.social__text').textContent = comment.message;
    elementDescription.querySelector('.social__picture').src = comment.avatar;

    return elementDescription;
  };

  var clearCommentsList = function () {
    var comments = bigPictureElement.querySelectorAll('.social__comment');
    comments.forEach(function (comment) {
      comment.remove();
    });
  };

  var displayBigPictureBlock = function () {
    var commentsCountElement = bigPictureElement.querySelector('.social__comment-count');
    var commentLoaderElement = bigPictureElement.querySelector('.comments-loader');
    bigPictureElement.classList.remove('hidden');
    commentsCountElement.classList.add('hidden');
    commentLoaderElement.classList.add('hidden');
  };

  var onCloseElementClick = function () {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('click', onCloseElementClick);
  };


  window.picture = {
    showBigPictureForm: showBigPictureForm,
  };

})();
