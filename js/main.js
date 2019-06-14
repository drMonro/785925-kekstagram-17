'use strict';

var PICTURES_COUNT = 25;
var PHOTO_URL_TEMPLATE = 'photos/{index}.jpg';
var MIN_LIKE_AMOUNT = 15;
var MAX_LIKE_AMOUNT = 200;
var AVATAR_URL_TEMPLATE = 'img/avatar-{index}.svg';
var NAMES = ['Ivan', 'Marya', 'Mika', 'Яков', 'Анна', 'Соня', 'Федор'];
var MAX_COMMENTS_AMOUNT = 6;
var COMMENTS_TEXTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?',
];


var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getComments = function (maxCommentsAmount, avatarUrlTemplate, commentTexts, names) {
  var comments = [];
  for (var i = 1; i <= getRandomNumber(1, maxCommentsAmount); i++) {
    comments.push({
      avatar: avatarUrlTemplate.replace('{index}', i),
      message: commentTexts[getRandomNumber(1, (commentTexts.length - 1))],
      name: names[getRandomNumber(1, (names.length - 1))],
    });
  }
  return comments;
};

var generatePhoto = function (index, photoSet) {
  return {
    url: photoSet.photoUrlTemplate.replace('{index}', index),
    likes: getRandomNumber(photoSet.minLikesAmount, photoSet.maxLikesAmount),
    comments: getComments(photoSet.maxCommentsAmount, photoSet.avatarUrlTemplate, photoSet.commentTexts, photoSet.names),
  };
};

var generateAllPhoto = function (picturesCount) {
  for (var i = 1; i <= picturesCount; i++) {
    pictures.push(generatePhoto(i, {
      photoUrlTemplate: PHOTO_URL_TEMPLATE,
      minLikesAmount: MIN_LIKE_AMOUNT,
      maxLikesAmount: MAX_LIKE_AMOUNT,
      maxCommentsAmount: MAX_COMMENTS_AMOUNT,
      avatarUrlTemplate: AVATAR_URL_TEMPLATE,
      commentTexts: COMMENTS_TEXTS,
      names: NAMES,
    }));
  }
  return pictures;
};

var renderPhotoBlock = function (photoBlock) {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = photoBlock.url;
  pictureElement.querySelector('.picture__likes').textContent = photoBlock.likes;
  pictureElement.querySelector('.picture__comments').textContent = photoBlock.comments.length;

  return pictureElement;
};

var renderAllPhotos = function (pictures, fragment, pictureBlock) {
  pictures.forEach(function (picture) {
    fragment.appendChild(renderPhotoBlock(picture));
  });

  pictureBlock.appendChild(fragment);
};


var pictures = [];
pictures = generateAllPhoto(PICTURES_COUNT);

var fragment = document.createDocumentFragment();
var pictureBlock = document.querySelector('.pictures');
renderAllPhotos(pictures, fragment, pictureBlock);
