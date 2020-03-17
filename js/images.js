'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];
  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';
  var OFFER_PHOTOS_LIMIT = 12;

  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var adImagesContainer = document.querySelector('.ad-form__photo-container');
  var imagesCooser = adImagesContainer.querySelector('#images');

  var validateFile = function (file) {
    return FILE_TYPES.some(function (it) {
      return file.name.toLowerCase().endsWith(it);
    });
  };

  var changeAvatar = function (newAvatarSrc) {
    avatarPreview.src = newAvatarSrc;
  };

  var addImage = function (imageSrc) {
    var newImage = document.createElement('div');
    newImage.classList.add('ad-form__photo');

    if (imageSrc) {
      newImage.style.backgroundImage = 'url(' + imageSrc + ')';
      newImage.style.backgroundRepeat = 'no-repeat';
      newImage.style.backgroundPosition = 'center';
      newImage.style.backgroundSize = 'contain';
    }

    adImagesContainer.appendChild(newImage);
  };

  var removeImages = function () {
    var images = adImagesContainer.querySelectorAll('.ad-form__photo');

    images.forEach(function (it) {
      it.remove();
    });
  };

  var uploadFile = function (fileChooser, action, removeFunction) {
    var files = Array.from(fileChooser.files).filter(validateFile);
    var takeNumber = files.length > OFFER_PHOTOS_LIMIT ? OFFER_PHOTOS_LIMIT : files.length;

    if (removeFunction) {
      removeFunction();
    }

    for (var i = 0; i < takeNumber; i++) {
      var reader = new FileReader();

      reader.addEventListener('load', function (evt) {
        action(evt.target.result);
      });

      reader.readAsDataURL(files[i]);
    }
  };

  var onAdPhotoAdd = function (evt) {
    uploadFile(evt.target, addImage, removeImages);
  };

  var onAvatarChange = function (evt) {
    uploadFile(evt.target, changeAvatar);
  };

  var toggleImageLoadState = function (disable) {
    if (disable) {
      changeAvatar(DEFAULT_AVATAR_SRC);
      removeImages();
      addImage();
      avatarChooser.removeEventListener('change', onAvatarChange);
      imagesCooser.removeEventListener('change', onAdPhotoAdd);
    } else {
      avatarChooser.addEventListener('change', onAvatarChange);
      imagesCooser.addEventListener('change', onAdPhotoAdd);
    }
  };

  window.toggleImageLoadState = toggleImageLoadState;
})();
