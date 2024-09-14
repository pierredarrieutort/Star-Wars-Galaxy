export enum StarType {
  Planet,
  Moon,
  Planetoid,
  System,
  IceAsteroidColony = 'Ice asteroid colony',
  AsteroidStation = 'Asteroid Station',
  SpaceStation = 'Space Station',
  PlanetGasGiant = 'Planet (Gas Giant)',
  HyperspaceBeacon = 'Hyperspace beacon'
}

export enum AtmosphereType {
  type1 = 'Type I',
  inhospitableType1 = 'Type I (but inhospitable)',
  type2 = 'Type II',
  type3 = 'Type III',
  type4 = 'Type IV',
  variable = 'variable'
}

export interface StarProperties {
  name: string
  icon: string
  type: StarType
  diameter: number
  atmosphere: AtmosphereType
  moons: string
  stars: string
  description: string
  isCannon: boolean
  isLegends: boolean
  thumbnail: string
  wikiLink: string
}

export interface StarGeometry {
  coordinates: {
    x: number,
    z: number
  }
  size: number
  radius: number
  offsetAngle: number
}

export default interface Star {
  properties: StarProperties
  geometry: StarGeometry
}
