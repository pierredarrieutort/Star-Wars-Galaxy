export interface Star {
  name: string
}

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

export interface StarTopology {
  type: StarType
  diameter: number
  atmosphere: AtmosphereType
  stars: string
  moons: string
}

export interface StarInMovies {
  isCannon: boolean
  isLegends: boolean
}
