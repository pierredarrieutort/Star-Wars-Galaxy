export default function exportToGeoJSON() {
  const features = [];

  // Parcourez les calques de votre carte
  map.eachLayer(layer => {
    // Vérifiez si la couche est une couche GeoJSON
    if (layer.toGeoJSON) {
      const geojson = layer.toGeoJSON();

      // Si la couche a un popup, ajoutez son contenu aux propriétés de la fonctionnalité GeoJSON
      if (layer.getPopup && layer.getPopup()) {
        geojson.properties.popupContent = layer.getPopup().getContent();
      }

      // Si la couche a un tooltip, ajoutez son contenu aux propriétés de la fonctionnalité GeoJSON
      if (layer.getTooltip && layer.getTooltip()) {
        geojson.properties.tooltipContent = layer.getTooltip().getContent();
      }

      if (geojson.features) {
        geojson.features.forEach(feature => {
          features.push(feature);
        });
      } else {
        features.push(geojson);
      }
    }
  });

  // Créez un objet GeoJSON avec toutes les fonctionnalités collectées
  const geojsonObject = {
    type: 'FeatureCollection',
    features: features,
  };

  // Convertissez l'objet GeoJSON en chaîne JSON
  const geojsonString = JSON.stringify(geojsonObject, null, 2);

  // Affichez la chaîne GeoJSON dans la console (vous pouvez également la télécharger ou l'utiliser comme vous le souhaitez)
  console.log(geojsonString);
}
