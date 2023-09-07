import rows from '../data/raw_stars_data'
import { StarTopology } from '../models/Star'

const cleanedDataArray = (row: object) => Object.entries(row).map(([key, val]) => {
  const detailsElement = document.createElement('section')
  const descriptionElement = document.createElement('section')

  const [details, description] = val.split('</div>')

  detailsElement.innerHTML = `${details}`.replace('<div>', '')
  descriptionElement.innerHTML = description

  const domElementsRemover = (el: HTMLElement) => {
    const deletablesElements = el.querySelectorAll('p, br, hr')
    deletablesElements.forEach(el => el.remove())
  }

  domElementsRemover(detailsElement)
  domElementsRemover(descriptionElement)

  const textCleaner = (text: string) => {
    return text
      .replace(/\s+/g, ' ')
      .trim()
  }

  const cleanedDescriptionText = textCleaner(descriptionElement.textContent as string)
  const cleanedDetailsText = textCleaner(detailsElement.textContent as string)
  const cleanedStarName = key.replace('Popup', '')

  descriptionElement.remove()
  detailsElement.remove()

  const { Type, Diameter, Atmosphere, Moons, Stars } = /(?<=Type:\s)(?<Type>.+)(?=Diameter:)\w+:\s(?<Diameter>.+)(?=Atmosphere:)\w+:\s(?<Atmosphere>.+)(?=Stars?:)\w+:\s(?<Stars>.+)(?=Moons?:)\w+:\s(?<Moons>.+)/gmi.exec(cleanedDetailsText)?.groups || {} as StarTopology

  return [cleanedStarName, {
    details: {
      Type,
      Diameter,
      Atmosphere,
      Moons,
      Stars
    },
    description: cleanedDescriptionText
  }]
})

const cleanedRows = Object.fromEntries(rows.map((row, index) => {
  const cleanedData = Object.fromEntries(cleanedDataArray(row))

  return [`row-${index + 1}`, cleanedData]
}))

// console.log(cleanedRows)
