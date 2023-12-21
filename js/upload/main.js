import { activateForm, deactivateForm } from './activation';
import { checkValidity, resetValidity } from './validation';
import { activateSlider, deactivateSlider } from './price.js';

deactivateForm();
deactivateSlider();

const form = document.querySelector('.ad-form');
// const submitButton = document.querySelector('ad-form__submit');

// const setSubmitDisabled = (flag) => {
//   submitButton.disabled = flag;
//   submitButton.textContent = flag ? 'Публикую...' : 'Опубликовать';
// };

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (checkValidity()) {
    // setSubmitDisabled(true);
    console.log('Отправить форму');
  }
});

form.addEventListener('reset', () => {
  resetValidity();
});

const setCoordinates = ({lat, lng}) => {
  form.address.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  form.address.dispatchEvent(new Event('change', {bubbles: true}));
};

export { activateForm, activateSlider, setCoordinates };
