import * as THREE from 'three'
import Experience from '../Experience.js'

import preCleanedData from '../../data-preparation/index.ts'
// import preCleanedData from '../../data-preparation/data/preCleanedData.ts'

export default class Planets {
  constructor () {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.raycaster = this.experience.raycaster
    this.camera = this.experience.camera
    this.canvas = this.experience.canvas

    this.rotationSpeed = .05

    if (this.debug.active) {
      this.debugPlanetsFolder = this.debug.ui.addFolder('Planets')

      this.debugPlanetsFolder
        .add(this, 'rotationSpeed')
        .min(-1)
        .max(1)
        .step(.1)
    }
    this.sphereGeometry = new THREE.SphereGeometry()

    this.setMaterials()

    // preCleanedData.length = 1
    console.log(preCleanedData)
    this.starGroups = preCleanedData.map(starData => this.createStar(starData))
  }

  createStar (starData) {
    const { x, z } = starData.geometry.coordinates

    starData.geometry.size = starData.properties.diameter
      ? starData.properties.diameter / 10000
      : starData.geometry.size = Math.random() * .2 + .1

    // Calcul de l'hypoténuse des coordonnées pour obtenir le radius depuis le centre de la scène.
    starData.geometry.radius = Math.sqrt(x ** 2 + z ** 2)

    // Calcul de l'angle en fonction de la position initiale de l'élément.
    starData.geometry.offsetAngle = Math.atan2(z, x)

    const { sphere, lineLoop } = this.createElements(starData)

    // Le "subGroup" sert à gérer la planète et les potentielles lunes.
    // Le "parentGroup" sert à gérer les potentielles rotations de la planètes et ses lunes.
    // Il sert aussi à ajouter le cercle de révolution et effectuer
    // des actions sur le cercle et le subGroup en même temps (ex: inclinaison du plan de révolution).

    const subGroup = new THREE.Group()
    const parentGroup = new THREE.Group()

    subGroup.position.set(x, 0, z)
    subGroup.add(sphere)

    parentGroup
      .add(subGroup, lineLoop)
      .rotateX(-Math.PI / ((Math.random() / 10) - 1) + Math.PI / 8)
      .rotateY(Math.PI / ((Math.random() / 10) - 1))
      .rotateZ(Math.PI / ((Math.random() / 10) - 1))
      .userData = starData

    this.scene.add(parentGroup)

    return parentGroup
  }

  setMaterials () {
    this.sphereMaterial = new THREE.MeshBasicMaterial({
      // map: this.resources.items.AldeeranPlanetTexture
    })
    this.lineLoopMaterial = new THREE.LineBasicMaterial({
      color: 0x0062FF,
      transparent: true,
      opacity: 0.03
    })

    if (this.debug.active) {
      const lineLoopDebugFolder = this.debugPlanetsFolder.addFolder('LineLoop')

      lineLoopDebugFolder
        .add(this.lineLoopMaterial, 'opacity')
        .min(0)
        .max(.25)
        .step(.01)
        .name('LineLoop opacity')

      lineLoopDebugFolder
        .addColor(this.lineLoopMaterial, 'color')

      lineLoopDebugFolder
        .add(this, 'destroyStarsLineLoops')
    }
  }

  createElements (starData) {
    const _sphereGeometry = this.sphereGeometry.clone()
    _sphereGeometry.scale(starData.geometry.size, starData.geometry.size, starData.geometry.size)

    const curve = new THREE.EllipseCurve(0, 0, starData.geometry.radius, starData.geometry.radius)
    const pts = curve.getSpacedPoints(16)
    const _lineLoopGeometry = new THREE.BufferGeometry()
      .setFromPoints(pts)
      .rotateX(Math.PI / 2)

    return {
      sphere: new THREE.Mesh(_sphereGeometry, this.sphereMaterial),
      lineLoop: new THREE.LineLoop(_lineLoopGeometry, this.lineLoopMaterial)
    }
  }

  update () {
    this.starGroups.forEach(({ children, userData }) => {
      const subGroup = children[0]
      const star = subGroup.children.find(child => child instanceof THREE.Mesh)

      const { offsetAngle, radius } = userData.geometry

      const cineticSpeed = this.time.elapsed * this.rotationSpeed

      // Rotation continue de la sphère sur elle-même
      star.rotation.x = cineticSpeed
      star.rotation.y = cineticSpeed

      // Rotation continue de chaque sphère autour du centre
      subGroup.position.x = Math.cos(cineticSpeed + offsetAngle) * radius
      subGroup.position.z = Math.sin(cineticSpeed + offsetAngle) * radius
    })
  }

  destroyStarsLineLoops () {
    for (const parentGroup of this.starGroups) {
      const lineLoop = parentGroup.children.find(child => child instanceof THREE.LineLoop)

      if (lineLoop) {
        lineLoop.removeFromParent()
        lineLoop.geometry.dispose()
        lineLoop.material.dispose()
      } else {
        console.info('No more lineLoop to remove.')
        break
      }
    }
  }
}
