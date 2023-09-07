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



console.log(Object.keys(points[0].properties))
console.log([...new Set(points.map(point => point.properties.moons))])
