export interface Star {
  name: string
}

export enum StarType {
  Planet,
  Moon,
  Planetoid,
  IceAsteroidColony = 'Ice asteroid colony',
  AsteroidStation = 'Asteroid Station',
  SpaceStation = 'Space Station',
  PlanetGasGiant = 'Planet (Gas Giant)'
}

export enum AtmosphereType {
  type1 = 'Type I',
  inhospitableType1 = 'Type I (but inhospitable)',
  type2 = 'Type II',
  type3 = 'Type III',
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
