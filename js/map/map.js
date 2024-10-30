import { leaflet } from './leaflet.js';
import { createCard } from './card.js';

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM = 13;

const mainJs = document.querySelector('script[src="js/main.js"]');
// hack for local build with vite
const devMainJs = mainJs.src.replace('client', 'main.js');
const imgPath = devMainJs.replace('main.js', '../img');

const iconConfig = {
  url: {
    main: `${imgPath}/main-pin.svg`,
    normal: `${imgPath}/pin.svg`
  },
  width: {main: 52, normal: 40},
  height: {main: 52, normal: 40},
  anchorX: {main: 26, normal: 20},
  anchorY: {main: 52, normal: 40},
};

const startCoordinate = {
  lat: 35.68306,
  lng: 139.75436,
};

let mapObject;

const getMap = () => {
  mapObject = mapObject ?? leaflet.map('map-canvas');
  return mapObject;
};

const initMap = () => {
  const map = getMap();
  map.on('load', () => {
    document.dispatchEvent(new Event('mapLoaded'));
  }).setView(startCoordinate, ZOOM);

  leaflet.tileLayer(TILE_LAYER, {
    attribution: COPYRIGHT
  }).addTo(map);
};

const mainPinIcon = leaflet.icon({
  iconUrl: iconConfig.url.main,
  iconSize: [iconConfig.width.main, iconConfig.height.main],
  iconAnchor: [iconConfig.anchorX.main, iconConfig.anchorY.main],
});

let mainPinMarkerObject;

const getMainPinMarker = () => {
  mainPinMarkerObject = mainPinMarkerObject ?? leaflet.marker(startCoordinate, {
    draggable: true,
    icon: mainPinIcon,
  });
  return mainPinMarkerObject;
};

const coordinateSelectionEvent = new CustomEvent('coordinateSelected', {
  detail: startCoordinate
});

const setMainPinMarker = () => {
  getMainPinMarker().addTo(getMap());
  document.dispatchEvent(coordinateSelectionEvent);

  getMainPinMarker().on('moveend', (event) => {
    document.dispatchEvent(new CustomEvent('coordinateSelected', {
      detail: event.target.getLatLng()
    }));
  });
};

let iconObject;
const getIcon = () => {
  iconObject = iconObject ?? leaflet.icon({
    iconUrl: iconConfig.url.normal,
    iconSize: [iconConfig.width.normal, iconConfig.height.normal],
    iconAnchor: [iconConfig.anchorX.normal, iconConfig.anchorY.normal],
  });
  return iconObject;
};

const markerGroup = leaflet.layerGroup().addTo(getMap());

const createMarker = (point, data) => {
  const {lat, lng} = point;
  const marker = leaflet.marker(
    {
      lat,
      lng,
    },
    {
      icon: getIcon(),
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(createCard(data));
};

const createMarkers = (announcements) => {
  markerGroup.clearLayers();
  announcements.forEach((announcement) => {
    createMarker(announcement.location, announcement);
  });
};

const resetMap = () => {
  getMainPinMarker().setLatLng(startCoordinate);
  getMap().setView(startCoordinate, ZOOM);
  getMap().closePopup();
  document.dispatchEvent(coordinateSelectionEvent);
};

export { initMap, resetMap, createMarkers, setMainPinMarker};
