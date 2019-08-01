'use strict';

(function () {
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var SCALE_STEP = 25;
  var FilterEffect = {
    NONE: '',
    CHROME: 'effects__preview--chrome',
    SEPIA: 'effects__preview--sepia',
    MARVIN: 'effects__preview--marvin',
    PHOBOS: 'effects__preview--phobos',
    HEAT: 'effects__preview--heat',
  };
  var FilerStyle = {
    none: '',
    chrome: {
      name: 'grayscale',
      max: 1,
      type: '',
    },
    sepia: {
      name: 'sepia',
      max: 1,
      type: '',
    },
    marvin: {
      name: 'invert',
      max: 100,
      type: '%',
    },
    phobos: {
      name: 'blur',
      max: 3,
      type: 'px',
    },
    heat: {
      name: 'brightness',
      max: 3,
      type: '',
    }
  };
  var imageBlock = document.querySelector('.img-upload__preview');
  var imgPreviewElement = imageBlock.querySelector('img');
  var imagePreview = imageBlock.children[0];
  var scaleDownButton = document.querySelector('.scale__control--smaller');
  var scaleUpButton = document.querySelector('.scale__control--bigger');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var pinElement = document.querySelector('.effect-level__pin');
  var depthEffectLine = document.querySelector('.effect-level__depth');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var filtersRadioElements = document.querySelectorAll('.effects__radio');
  var DEFAULT_VALUE = 100;
  var currentScaleValue = DEFAULT_VALUE;
  var currentEffectLevel = DEFAULT_VALUE;
  var selectedFilter = null;
  var levelLineWidth = 0;
  var levelPinCoordinates = null;
  var levelLineCoordinates = null;
  var startPosition = null;


  var setFilterVisible = function (isVisible) {
    var effectLevelBlock = document.querySelector('.effect-level');
    if (isVisible) {
      effectLevelBlock.classList.remove('hidden');
      resetFilterDuration();
    } else {
      effectLevelBlock.classList.add('hidden');
    }
  };

  var resetFilters = function () {
    filtersRadioElements[0].checked = true;
    selectedFilter = null;
    imagePreview.className = '';
    currentScaleValue = DEFAULT_VALUE;
    currentEffectLevel = DEFAULT_VALUE;
    renderScaledImage(currentScaleValue);
    resetFilterDuration();
    renderFilteredImage(selectedFilter);
    setFilterVisible(false);
  };

  var resetFilterDuration = function () {
    levelLineWidth = effectLevelLine.offsetWidth;
    currentEffectLevel = DEFAULT_VALUE;
    pinElement.style.left = levelLineWidth + 'px';
    depthEffectLine.style.width = currentEffectLevel + '%';
    effectLevelValue.value = currentEffectLevel;
  };

  var renderFilteredImage = function (chosenFilter) {
    if (FilerStyle[chosenFilter]) {
      var name = FilerStyle[chosenFilter].name;
      var value = FilerStyle[chosenFilter].max / 100 * currentEffectLevel;
      var type = FilerStyle[chosenFilter].type;
      imagePreview.style.filter = name + '(' + value + type + ')';
    } else {
      imagePreview.style.filter = '';
    }
  };

  var imageZoomOut = function (value, scaleStep) {
    value -= scaleStep;
    renderScaledImage(value);
  };

  var imageZoomIn = function (value, scaleStep) {
    value += scaleStep;
    renderScaledImage(value);
  };

  var renderScaledImage = function (value) {
    var scaleValueElement = document.querySelector('.scale__control--value');
    scaleValueElement.value = value + '%';
    imagePreview.style.transform = 'scale(' + value / 100 + ')';
  };

  var setFilterPanelBehavior = function () {
    filtersRadioElements.forEach(function (filter) {
      filter.addEventListener('change', function () {
        chooseFilter(filter);
      });
    });
  };

  var chooseFilter = function (filter) {
    selectedFilter = filter.value;

    if (selectedFilter === 'none') {
      resetFilters();
      setFilterVisible(false);
    } else {
      setFilterVisible(true);
      renderFilteredImage(selectedFilter);
    }

    imagePreview.className = FilterEffect[selectedFilter];
    currentEffectLevel = DEFAULT_VALUE;
  };

  var getElementCoordinates = function (elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
    };
  };

  var getPercentsByCoordinates = function (total, current) {
    return Math.round(100 / total * current);
  };

  var onSliderMouseDrag = function (evt) {
    levelPinCoordinates = getElementCoordinates(pinElement);
    levelLineCoordinates = getElementCoordinates(effectLevelLine);
    startPosition = evt.pageX - levelPinCoordinates.left;

    document.addEventListener('mousemove', onSliderMouseMove);
    document.addEventListener('mouseup', onSliderMouseUp);
    return false;
  };

  var onSliderMouseUp = function () {
    document.removeEventListener('mousemove', onSliderMouseMove);
    document.removeEventListener('mouseup', onSliderMouseUp);
  };

  var onSliderMouseMove = function (evt) {
    var newPosition = evt.pageX - startPosition - levelLineCoordinates.left;

    if (newPosition < 0) {
      newPosition = 0;
    } else if (newPosition > levelLineWidth) {
      newPosition = levelLineWidth;
    }

    pinElement.style.left = newPosition + 'px';
    currentEffectLevel = getPercentsByCoordinates(levelLineWidth, newPosition);
    depthEffectLine.style.width = currentEffectLevel + '%';
    effectLevelValue.value = currentEffectLevel;
    renderFilteredImage(selectedFilter);
  };


  scaleDownButton.addEventListener('click', function () {
    if (currentScaleValue > MIN_SCALE) {
      imageZoomOut(currentScaleValue, SCALE_STEP);
      currentScaleValue -= SCALE_STEP;
    }
  });

  scaleDownButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.form.SPACE_BAR_KEY_CODE && currentScaleValue > MIN_SCALE) {
      imageZoomOut(currentScaleValue, SCALE_STEP);
      currentScaleValue -= SCALE_STEP;
    }
  });

  scaleUpButton.addEventListener('click', function () {
    if (currentScaleValue < MAX_SCALE) {
      imageZoomIn(currentScaleValue, SCALE_STEP);
      currentScaleValue += SCALE_STEP;
    }
  });

  scaleUpButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.form.SPACE_BAR_KEY_CODE && currentScaleValue < MAX_SCALE) {
      imageZoomIn(currentScaleValue, SCALE_STEP);
      currentScaleValue += SCALE_STEP;
    }
  });

  pinElement.addEventListener('mousedown', onSliderMouseDrag);

  setFilterPanelBehavior();


  window.preview = {
    resetFilters: resetFilters,
    imgPreviewElement: imgPreviewElement
  };

})();
