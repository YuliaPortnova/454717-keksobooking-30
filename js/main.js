import { activateForm, activateSlider, setCoordinates, setSubmitDisabled, resetUpload } from './upload/main.js';
import { initMap, activateMap, activateFilters, resetMapWithFilters } from './map/main.js';
import { request } from './api.js';
import { renderStatus } from './status.js';
import { throttle } from './utilities.js';

const BASE_URL = 'https://30.javascript.pages.academy/keksobooking';
const resetButton = document.querySelector('.ad-form__reset');

let announcements;
let isMapLoaded = false;
const onDocumentMapLoaded = async () => {
  if (!isMapLoaded) {
    try {
      announcements = await request(`${BASE_URL}/data`);
      activateMap(announcements, throttle);
      activateFilters();
      activateForm();
      activateSlider();
      isMapLoaded = true;
    } catch {
      renderStatus('data-error');
    }
  }
};

document.addEventListener('mapLoaded', onDocumentMapLoaded);
document.addEventListener('coordinateSelected', (event) => {
  setCoordinates(event.detail);
});

const onResetButtonClick = () => {
  resetButton.click();
  resetMapWithFilters(announcements);
  resetUpload();
};

resetButton.addEventListener('click', onResetButtonClick);

document.addEventListener('formdata', async (event) => {
  try {
    setSubmitDisabled(true);
    await request(BASE_URL, {method: 'post', body: event.formData});
    resetButton.click();
    renderStatus('success');
  } catch {
    renderStatus('error');
  } finally {
    setSubmitDisabled(false);
  }
});

initMap();
