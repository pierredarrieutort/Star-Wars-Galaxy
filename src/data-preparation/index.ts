import geojson from './data/raw_geojson_from_leaflet.json'
import extractPopupContent from './helpers/extractPopupContent'

// Get only points at this time
const points = geojson.features
  .filter(
    obj => obj.geometry.type === 'Point' &&
      obj.properties.tooltipContent !== 'Look revealing label!' &&
      !['LatLng Marker', '<b>Corellia</b>'].includes(obj.properties.popupContent)
  )

points.forEach(point => {
  delete point.type

  // Clean star properties
  point.properties.popupContent &&= extractPopupContent(point.properties.popupContent)

  // Reorganize data
  point.properties = {
    name: point.properties.tooltipContent,
    icon: point.properties.icon,
    ...point.properties.popupContent
  }

  point.geometry.coordinates = {
    x: point.geometry.coordinates[0],
    z: -(point.geometry.coordinates[1])
  }

  // Removing original Leaflet's extracted map center offset : LatLng(-121.75, 124.625).
  point.geometry.coordinates.x -= 124.625
  point.geometry.coordinates.z -= 121.75
})

//? Remove results before 'A' because they're test values from extract.
const indexA = points.findIndex(obj => obj.properties.name === 'A')
points.splice(0, indexA)

//? Remove results before '23' included because they're test values from extract.
const index23 = points.findIndex(obj => obj.properties.name === 'Belkadan')
points.splice(0, index23)

// console.log(points.map(point => point))

export default points
