function exportToGeoJSON () {
  const geojsonObject = {
    type: 'FeatureCollection',
    features: []
  }

  // Add to map non-linked FeatureGroups declared in Window.
  for (const variableName in window) {
    if (variableName !== 'map' && window[variableName]?._layers) {
      window.map.addLayer(window[variableName])
    }
  }

  function handleFeature (layer, geojson) {
    if (layer.toGeoJSON) {
      geojson ||= layer.toGeoJSON()

      if (layer.getPopup && layer.getPopup()) {
        geojson.properties.popupContent = layer.getPopup().getContent()
      }

      if (layer.getTooltip && layer.getTooltip()) {
        geojson.properties.tooltipContent = layer.getTooltip().getContent()
      }

      geojsonObject.features.push(geojson)
    }
  }

  window.map.eachLayer(layer => {
    if (layer.toGeoJSON) {
      const geojson = layer.toGeoJSON()

      if (geojson.type === 'FeatureCollection') {
        geojson.features.forEach(handleFeature)
      } else {
        handleFeature(layer, geojson)
      }
    }
  })

  console.info(JSON.stringify(geojsonObject))
}
