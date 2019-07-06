'use strict';

(function () {
  var renderPicture = function (photoArrayElement, index) {
    var picture = window.data.pictureTemplate.cloneNode(true);

    picture.querySelector('.picture__img').src = photoArrayElement[index].url;
    picture.querySelector('.picture__comments').textContent = photoArrayElement[index].comments.length;
    picture.querySelector('.picture__likes').textContent = photoArrayElement[index].likes;

    return picture;
  };

  window.picture = {
    renderPicture: renderPicture
  };

})();
