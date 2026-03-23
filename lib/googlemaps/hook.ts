import { importLibrary } from '@googlemaps/js-api-loader'

export const loadGoogleMaps = async () => {
  await importLibrary('places')
}
