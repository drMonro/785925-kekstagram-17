'use strict';

(function () {
  var PICTURES_COUNT = 25;
  var PHOTO_URL_TEMPLATE = 'photos/{index}.jpg';
  var PHOTO_URL_MOCK = '{index}';
  var MIN_LIKE_AMOUNT = 15;
  var MAX_LIKE_AMOUNT = 200;
  var AVATAR_URL_TEMPLATE = 'img/avatar-{index}.svg';
  var NAMES = [
    'Ivan',
    'Marya',
    'Mika',
    'Яков',
    'Анна',
    'Соня',
    'Федор',
  ];
  var MAX_COMMENTS_AMOUNT = 6;
  var MIN_COMMENTS_AMOUNT = 1;
  var COMMENTS_TEXTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?',
  ];


  var getRandomNumberFromRange = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var getComments = function (photoSet) {
    var comments = [];
    for (var i = 1; i <= getRandomNumberFromRange(photoSet.minCommentsAmount, photoSet.maxCommentsAmount); i++) {
      comments.push({
        avatar: photoSet.avatarUrlTemplate.replace(photoSet.avatarUrlMock, i),
        message: photoSet.commentTexts[getRandomNumberFromRange(0, (photoSet.commentTexts.length - 1))],
        name: photoSet.names[getRandomNumberFromRange(0, (photoSet.names.length - 1))],
      });
    }
    return comments;
  };

  var generatePhoto = function (index, photoSet) {
    return {
      url: photoSet.photoUrlTemplate.replace(photoSet.avatarUrlMock, index),
      likes: getRandomNumberFromRange(photoSet.minLikesAmount, photoSet.maxLikesAmount),
      comments: getComments(photoSet),
    };
  };

  var generateAllPhoto = function (picturesCount, photoSet) {
    var pictures = [];
    for (var i = 1; i <= picturesCount; i++) {
      pictures.push(generatePhoto(i, photoSet));
    }
    return pictures;
  };


  var picturesData = generateAllPhoto(PICTURES_COUNT, {
    photoUrlTemplate: PHOTO_URL_TEMPLATE,
    minLikesAmount: MIN_LIKE_AMOUNT,
    maxLikesAmount: MAX_LIKE_AMOUNT,
    maxCommentsAmount: MAX_COMMENTS_AMOUNT,
    minCommentsAmount: MIN_COMMENTS_AMOUNT,
    avatarUrlTemplate: AVATAR_URL_TEMPLATE,
    avatarUrlMock: PHOTO_URL_MOCK,
    commentTexts: COMMENTS_TEXTS,
    names: NAMES,
  });


  window.data = {
    picturesData: picturesData,
  };

})();
