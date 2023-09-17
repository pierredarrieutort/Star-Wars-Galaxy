import { StarTopology, AtmosphereType, StarType } from '../models/Star'

export default function extractPopupContent (htmlAsString: string) {
  // Set templates to avoid img tring to load content.
  // Why set DOM elements ? -> I prefer work with DOM rathan than strings.
  const detailsElement = document.createElement('template')
  const descriptionElement = document.createElement('template')

  // Remove parent div of "details" and get as array two child, but still as string.
  const [details, description] = htmlAsString
    .replace('<div>', '')
    .split('</div>')

  // Pass them to pure HTML (so child tags will be setted too).
  detailsElement.innerHTML = details
  descriptionElement.innerHTML = description

  // Remove all useless elements
  const domElementsRemover = (el: HTMLTemplateElement) => {
    // Removing "p" because used for the name (and we already have it), so it's useless.
    const deletablesElements = el.content.querySelectorAll('p, br, hr')
    deletablesElements.forEach(el => el.remove())
  }

  // Do the same actions for the two DOM elements.
  domElementsRemover(detailsElement)
  domElementsRemover(descriptionElement)

  // Get All the images names.
  const contentImages = [
    ...detailsElement.content.querySelectorAll('img'),
    ...descriptionElement.content.querySelectorAll('img')
  ].map(({ src }) => new URL(src).pathname.split('/').pop())

  // Check if 't-canon2.png' is in array.
  const isCanon = contentImages.includes('t-canon2.png')

  // Check if 't-legend2.png' or 't-legends2.png' are in array.
  const isLegends = contentImages.some(src => /t-legends?2\.png/.test(src))

  // Get the src wich is not canon or legends.
  let thumbnail = contentImages.find(src => !/t-(canon|legends?)2\.png/.test(src))

  // Keeping only name of thumb src, removing 'Sm' prefix and '.png' extension.
  thumbnail &&= thumbnail.match(/(?<=Sm).+(?=\.png)/)?.[0]

  // Make undefined values generic and normalized.
  if (thumbnail === 'NoImage') {
    thumbnail = undefined
  }

  // Replacing multiple spaces by one and removing start & ending spaces.
  const textCleaner = (text: string) => {
    return text
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Cleaning texts.
  const cleanedDescriptionText = textCleaner(descriptionElement.content.textContent as string)
  const cleanedDetailsText = textCleaner(detailsElement.content.textContent as string)

  // Removing from DOM memory.
  descriptionElement.remove()
  detailsElement.remove()

  // Extracting keywords and their values.
  const { type, diameter, atmosphere, moons, stars } = /(?<=Type:\s)(?<type>.+)(?=Diameter:)\w+:\s(?<diameter>.+)(?=Atmosphere:)\w+:\s(?<atmosphere>.+)(?=Stars?:)\w+:\s(?<stars>.+)(?=Moons?:)\w+:\s(?<moons>.+)/gmi.exec(cleanedDetailsText)?.groups || {} as StarTopology

  // Returning a data-cleaned properties object.
  return {
    type: starTypeValidator(normalizeBasicString(type)),
    diameter: normalizeDiameter(diameter),
    atmosphere: atmosphereTypeValidator(normalizeAtmosphere(atmosphere)),
    moons: normalizeBasicString(moons),
    stars: normalizeBasicString(stars),
    description: cleanedDescriptionText,
    isCanon,
    isLegends,
    thumbnail
  }
}

function normalizeDiameter (diameter: number | string | undefined = 'unknown'): number | undefined {
  // When passing as 'diameter' parameter, undefined value is set to 'unknown'.
  // Some values are defined as 'unknown' before passing as diameter parameter.
  // So the values are now normalized.

  // If already a number, return it
  if (typeof diameter === 'number') {
    return diameter
  }

  // 'unknown', '-', '?' values are now set to undefined to normalize all and stop the function by 'return'.
  if (/(unknown|-|\?)/i.test(diameter)) {
    return undefined
  }

  // Check if the value NOT contains 'km'.
  if (!/km/i.test(diameter)) {
    // '!isNaN' checking is it's a number,
    // but before, replacing US number writing (they use coma to separate thousands).
    if (!isNaN(diameter.replace(',', ''))) {
      // if number pattern is confirmed, return string as real Number.
      return Number(diameter)
    }

    // Triggers error if diameter value is weird (not undefined and not a number pattern).
    console.error(`Unknown distance value : ${diameter}`)
  }

  // Removing 'km' from string.
  // Trimming spaces.
  // Get only the first number is severals are in string.
  // The 'match' line : Matches the 1st number in the str (ignoring non-digits at start and stopping at end of first number).
  // The 'replace' line : Converts US notation to normal number.
  const diameterAsNumber = Number(
    diameter
      .match(/^[\D\s]*([\d,]+)/)[0]
      .replace(',', '')
  )

  return diameterAsNumber
}

function normalizeAtmosphere (atmosphere: string | undefined = 'unknown'): string | undefined {
  // 'undefined' values are set to 'unknown' to normalize them.

  // 'unknown', 'none', '-' values are now set to undefined to normalize all and stop the function by 'return'.
  if (/unknown|none|-/i.test(atmosphere)) {
    return undefined
  }

  return atmosphere
}

function normalizeBasicString (str: string = 'unknown'): string | undefined {
  // 'undefined' values are set to 'unknown' to normalize them.

  // 'unknown', '-' values are now set to undefined to normalize all and stop the function by 'return'.
  if (/unknown|-/i.test(str)) {
    return undefined
  }

  return str
}

// Validating is the atmoshpere is validated by linked TS enum.
function atmosphereTypeValidator (value: any): value is AtmosphereType {
  if (value && !Object.values(AtmosphereType).includes(value)) {
    console.error(`The following atmosphere type is not valid : ${value}`)
  }

  return value
}

// Validating is the star type is validated by linked TS enum.
function starTypeValidator (value: any): value is StarType {
  if (value && !Object.values(StarType).includes(value)) {
    console.error(`The following star type is not valid : ${value}`)
  }

  return value
}
