'use strict';

(function () {
  var MIN_COMMENTS_COUNT = 5;

  var bigPictureForm = document.querySelector('.big-picture');
  var commentsLoaderButton = bigPictureForm.querySelector('.comments-loader');
  var commentsList = document.querySelector('.social__comments');
  var bigPictureCommentInput = document.querySelector('.social__footer-text');
  var comments = [];
  var commentLoaderElement = bigPictureForm.querySelector('.comments-loader');
  var commentIndex = 0;
  var commentsCounterElement = bigPictureForm.querySelector('.comments-count');


  var showFormWithData = function (data) {
    var bigPictureCloseElement = bigPictureForm.querySelector('.big-picture__cancel');

    displayBigPicture(data);
    window.utils.showHiddenBlock(bigPictureForm);
    commentsLoaderButton.addEventListener('click', onLoaderCommentsClick);
    bigPictureCloseElement.addEventListener('click', onBigPictureClose);

    document.addEventListener('keydown', function (evt) {
      window.utils.invokeIfEscEvent(evt, onBigPictureClose);
    });
  };

  var displayBigPicture = function (dataPhoto) {
    var bigPictureBlock = bigPictureForm.querySelector('.big-picture__img');
    var bigPictureImgElement = bigPictureBlock.querySelector('img');
    var likesCounterElement = bigPictureForm.querySelector('.likes-count');
    var bigPictureDescription = bigPictureForm.querySelector('.social__caption');

    comments = dataPhoto.comments;
    resetIndex();
    var firstLoadCommentList = getCommentListFragment(comments);
    clearCommentsList();
    commentsList.appendChild(firstLoadCommentList);

    bigPictureImgElement.src = dataPhoto.url;
    likesCounterElement.textContent = dataPhoto.likes;
    commentsCounterElement.textContent = dataPhoto.comments.length;
    bigPictureDescription.textContent = dataPhoto.description;
  };

  var clearCommentsList = function () {
    var commentsElements = bigPictureForm.querySelectorAll('.social__comment');

    commentsElements.forEach(function (comment) {
      comment.remove();
    });
  };

  var onLoaderCommentsClick = function () {
    var fragmentCommentList = getCommentListFragment(comments);
    commentsList.appendChild(fragmentCommentList);
  };

  var onBigPictureClose = function () {
    bigPictureForm.classList.add('hidden');
    resetIndex();
    bigPictureCommentInput.value = '';
    commentsLoaderButton.removeEventListener('click', onLoaderCommentsClick);
    document.removeEventListener('click', onBigPictureClose);
  };

  var getCommentListFragment = function (commentsFragment) {
    var fragment = document.createDocumentFragment();
    var counter = 0;

    while (commentIndex < commentsFragment.length && counter < MIN_COMMENTS_COUNT) {
      fragment.appendChild(createComment(commentsFragment[commentIndex]));
      commentIndex++;
      counter++;
    }
    if (commentIndex < commentsFragment.length) {
      commentLoaderElement.classList.remove('hidden');
    } else {
      commentLoaderElement.classList.add('hidden');
    }
    setCommentsCount();
    return fragment;
  };

  var createComment = function (comment) {
    var commentElement = bigPictureForm.querySelector('.social__comment');
    var elementDescription = commentElement.cloneNode(true);

    elementDescription.querySelector('.social__text').textContent = comment.message;
    elementDescription.querySelector('.social__picture').src = comment.avatar;
    return elementDescription;
  };

  var setCommentsCount = function () {
    var socialCommentsCurrentCnt = bigPictureForm.querySelector('.current-comments-count');
    socialCommentsCurrentCnt.textContent = commentIndex;

  };

  var resetIndex = function () {
    commentIndex = 0;
  };


  window.picture = {
    showFormWithData: showFormWithData
  };

})();


