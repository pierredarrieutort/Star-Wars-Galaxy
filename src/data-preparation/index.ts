import geojson from './data/raw_geojson_from_leaflet.json'
import extractPopupContent from './helpers/extractPopupContent'

// Get only points at this time
const points = geojson.features
  .filter(
    obj => obj.geometry.type === 'Point' &&
      obj.properties.tooltipContent !== 'Look revealing label!' &&
      !['LatLng Marker', '<b>Corellia</b>'].includes(obj.properties.popupContent)
  )

let sumX = 0
let sumZ = 0

points.forEach(point => {
  delete point.type

  // Clean star properties
  point.properties.popupContent &&= extractPopupContent(point.properties.popupContent)

  // Reorganize data
  point.properties = {
    name: point.properties.tooltipContent,
    ...point.properties.popupContent
  }

  point.geometry.coordinates = {
    x: point.geometry.coordinates[0],
    z: -(point.geometry.coordinates[1])
  }

  sumX += point.geometry.coordinates.x
  sumZ += point.geometry.coordinates.z
})

const offsetX = -20; // Remplacez par la valeur souhaitée pour l'offset en X
const offsetZ = -30; // Remplacez par la valeur souhaitée pour l'offset en Z

// Ajouter les offsets à chaque point
points.forEach(point => {
  point.geometry.coordinates.x += offsetX;
  point.geometry.coordinates.z += offsetZ;
})

//? Remove results before 'A' because they're test values from extract.
const indexA = points.findIndex(obj => obj.properties.name === 'A')
points.splice(0, indexA)

//? Remove results before '23' included because they're test values from extract.
const index23 = points.findIndex(obj => obj.properties.name === 'Belkadan')
points.splice(0, index23)




const centerX = sumX / points.length
const centerZ = sumZ / points.length

// Étape 2 : Calculer la différence entre le centre du graphique et le centre du nuage de points
const graphCenterX = 0
const graphCenterZ = 0

const deltaX = graphCenterX - centerX
const deltaZ = graphCenterZ - centerZ

points.forEach(point => {
  point.geometry.coordinates.x += deltaX / 2
  point.geometry.coordinates.z += deltaZ / 2
})

// console.log(points.map(point => point.properties))

export default points
