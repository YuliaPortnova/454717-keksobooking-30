import '../../vendor/pristine/pristine.min.js';

const PHOTO = {
  defaultSrc: 'img/muffin-grey.svg',
  size: '70',
};

const TITLE_LENGTH = {
  min: 30,
  max: 100
};

const price = {
  max: 100000,
  min: {
    'flat': 1000,
    'bungalow': 0,
    'house': 5000,
    'palace': 10000,
    'hotel': 3000,
  }
};

const messages = {
  required: 'Это обязательное поле',
  capacity: 'Количество комнат не соответствует количеству гостей'
};

const form = document.querySelector('.ad-form');
const inputs = form.querySelectorAll('input');
const avatarPreview = form.querySelector('.ad-form-header__preview img');
const photoPreviewContainer = form.querySelector('.ad-form__photo');

inputs.forEach((input) => {
  if (input.hasAttribute('required')) {
    input.setAttribute('data-pristine-required-message', messages.required);
  }
});

const pristine = new Pristine(form, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
});

const validateLength = (text) => text.length >= TITLE_LENGTH.min && text.length <= TITLE_LENGTH.max;

pristine.addValidator (
  form.title,
  validateLength,
  `Требуемая длина сообщения от ${TITLE_LENGTH.min} до ${TITLE_LENGTH.max} символов`
);

pristine.addValidator (
  form.price,
  (number) => number <= price.max,
  `Максимальное значение не должно превышать ${price.max} руб`
);

const validatePrice = (value) => value >= price.min[form.type.value];

const getPriceErrorMessage = () => {
  const currentType = form.querySelector('[name="type"] :checked');
  return `Минимальное значение ${price.min[currentType.value]} руб`;
};

pristine.addValidator (
  form.price,
  validatePrice,
  getPriceErrorMessage
);

const isNumberOfRoomsFits = (numberOfRooms, numberOfGuests, notForGuestsNumber = 100) => {
  numberOfRooms = Number(numberOfRooms);
  numberOfGuests = Number(numberOfGuests);
  const isNumberOfGuestsFits = numberOfRooms >= notForGuestsNumber
    ? numberOfGuests === 0
    : numberOfGuests <= numberOfRooms;
  return numberOfGuests === 0
    ? numberOfRooms >= notForGuestsNumber
    : isNumberOfGuestsFits;
};

pristine.addValidator (
  form.capacity,
  (numberOfGuests) => isNumberOfRoomsFits(form.rooms.value, numberOfGuests),
  messages.capacity
);

pristine.addValidator (
  form.rooms,
  (numberOfRooms) => isNumberOfRoomsFits(numberOfRooms, form.capacity.value),
  messages.capacity
);

const synchronizeTime = (selectNameFirst, selectNameSecond) => {
  form[selectNameFirst].value = form[selectNameSecond].value;
};

const renderFile = (file, preview) => {
  if (file.type.startsWith('image')) {
    preview.src = URL.createObjectURL(file);
  }
};

const createImage = () => {
  const photoPreview = document.createElement('img');
  photoPreview.src = '';
  photoPreview.width = PHOTO.size;
  photoPreview.height = PHOTO.size;
  photoPreviewContainer.appendChild(photoPreview);
  return photoPreview;
};

const resetImages = () => {
  photoPreviewContainer.innerHTML = '';
  avatarPreview.src = PHOTO.defaultSrc;
};

form.addEventListener('change', (event) => {
  switch (event.target.name) {
    case 'type':
      form.price.placeholder = price.min[event.target.value];
      pristine.validate(form.price);
      break;
    case 'rooms':
      pristine.validate(form.capacity);
      break;
    case 'capacity':
      pristine.validate(form.rooms);
      break;
    case 'price':
      pristine.validate(form.price);
      break;
    case 'timein':
      synchronizeTime('timeout', 'timein');
      break;
    case 'timeout':
      synchronizeTime('timein', 'timeout');
      break;
    case 'avatar':
      pristine.validate(form.avatar);
      renderFile(event.target.files[0], avatarPreview);
      break;
    case 'images':
      renderFile(event.target.files[0], createImage());
      break;
  }
});

const checkValidity = () => pristine.validate();

const resetValidity = () => {
  form.price.placeholder = price.min['flat'];
  resetImages();
  pristine.reset();
};

export { checkValidity, resetValidity };
