import { StarTopology, AtmosphereType, StarType } from '../models/Star'

export default function extractPopupContent (htmlAsString: string) {
  const detailsElement = document.createElement('section')
  const descriptionElement = document.createElement('section')

  const [details, description] = htmlAsString.split('</div>')

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

  descriptionElement.remove()
  detailsElement.remove()

  const { type, diameter, atmosphere, moons, stars } = /(?<=Type:\s)(?<type>.+)(?=Diameter:)\w+:\s(?<diameter>.+)(?=Atmosphere:)\w+:\s(?<atmosphere>.+)(?=Stars?:)\w+:\s(?<stars>.+)(?=Moons?:)\w+:\s(?<moons>.+)/gmi.exec(cleanedDetailsText)?.groups || {} as StarTopology

  return {
    type: starTypeValidator(normalizeBasicString(type)),
    diameter: normalizeDiameter(diameter),
    atmosphere: atmosphereTypeValidator(normalizeAtmosphere(atmosphere)),
    moons: normalizeBasicString(moons),
    stars: normalizeBasicString(stars),
    description: cleanedDescriptionText
  }
}

function normalizeDiameter (diameter: string | undefined = 'unknown'): number | undefined {
  // If string is undefined or value not known/
  if (/(unknown|\?)/i.test(diameter)) {
    return undefined
  }

  if (!/km/i.test(diameter)) {
    if (!isNaN(diameter.replace(',',''))) {
      return Number(diameter)
    }

    console.error(`Unknown distance value : ${diameter}`)
  }

  diameter = diameter.replace(' km', '')
  
  
  const diameterAsNumber = Number(
    diameter
      .match(/^[\D\s]*([\d,]+)/)[0] // Matches the 1st number in the str (ignoring non-digits at start and stopping at end of first number).
      .replace(',','') // Converts US notation to normal number.
  )

  return diameterAsNumber
}

function normalizeAtmosphere (atmosphere: string | undefined = 'unknown'): string | undefined {
  if (/unknown|none|-/i.test(atmosphere)) {
    return undefined
  }

  return atmosphere
}

function normalizeBasicString (str: string = 'unknown'): string | undefined {
  if (/unknown|-/i.test(str)) {
    return undefined
  }

  return str
}

function atmosphereTypeValidator(value: any): value is AtmosphereType {
  if (value && !Object.values(AtmosphereType).includes(value)) {
    console.error(`The following atmosphere type is not valid : ${value}`)
  }

  return value
}

function starTypeValidator(value: any): value is StarType {
  if (value && !Object.values(StarType).includes(value)) {
    console.error(`The following star type is not valid : ${value}`)
  }

  return value
}
