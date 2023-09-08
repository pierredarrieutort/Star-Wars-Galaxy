import geojson from './data/raw_geojson'
import extractPopupContent from './helpers/extractPopupContent'

// Get only points at this time
const points = geojson.features.filter(obj => obj.geometry.type === 'Point')

for (const pointIndex in points) {
  const point = points[pointIndex]

  // Clean star properties
  point.properties.popupContent &&= extractPopupContent(point.properties.popupContent)

  // Reorganize data
  point.properties = {
    name: point.properties.tooltipContent,
    ...point.properties.popupContent
  }
}

//! Remove results before 'A' because they're test values from extract.
const indexA = points.findIndex(obj => obj.properties.name === 'A')
points.splice(0, indexA)

//! Remove results before '23' included because they're test values from extract.
const index23 = points.findIndex(obj => obj.properties.name === 'Belkadan')
points.splice(0, index23)

console.log(points[0])
console.log(points.map(point => point.properties.name))
