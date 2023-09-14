import * as THREE from 'three'
import Experience from '../Experience.js'
import cleanedGeoJSON from '../../data-preparation/index.ts'

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

    if (this.debug.active) {
      this.debugPlanetsFolder = this.debug.ui.addFolder('Planets')
    }

    this.rotationSpeed = .05
    this.sphereGeometry = new THREE.SphereGeometry()

    this.setMaterials()

    this.starGroups = cleanedGeoJSON.map(starData => this.createStar(starData))
  }

  createStar (starData) {
    const { x, z } = starData.geometry.coordinates

    //? Mocking size before using Diameter value.
    starData.geometry.size = Math.random() * .2 + .1

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
      .add(lineLoop, subGroup)
      .rotateX(-Math.PI / ((Math.random() / 10) - 1) + Math.PI / 8)
      .rotateY(Math.PI / ((Math.random() / 10) - 1))
      .rotateZ(Math.PI / ((Math.random() / 10) - 1))
      .userData = starData

    this.scene.add(parentGroup)

    return parentGroup
  }

  setMaterials () {
    this.sphereMaterial = new THREE.MeshLambertMaterial()
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
        .max(1)
        .step(.1)
        .name('LineLoop opacity')

      lineLoopDebugFolder
        .addColor(this.lineLoopMaterial, 'color')
    }
  }

  createElements (starData) {
    const _sphereGeometry = this.sphereGeometry.clone()
    _sphereGeometry.scale(starData.geometry.size, starData.geometry.size, starData.geometry.size)

    const curve = new THREE.EllipseCurve(0, 0, starData.geometry.radius, starData.geometry.radius)
    const pts = curve.getSpacedPoints(256)
    const _lineLoopGeometry = new THREE.BufferGeometry()
      .setFromPoints(pts)
      .rotateX(Math.PI / 2)

    return {
      sphere: new THREE.Mesh(_sphereGeometry, this.sphereMaterial),
      lineLoop: new THREE.LineLoop(_lineLoopGeometry, this.lineLoopMaterial)
    }
  }

  update () {
    this.starGroups.forEach(parentGroup => {
      const { children, userData } = parentGroup
      const [lineLoop, subGroup] = children
      const [star] = subGroup.children
      const { offsetAngle, radius } = userData.geometry

      // Rotation continue de la sphère sur elle-même
      star.rotation.x = this.time.elapsed * this.rotationSpeed
      star.rotation.y = this.time.elapsed * this.rotationSpeed

      // Rotation continue de chaque sphère autour du centre
      subGroup.position.x = Math.cos(this.time.elapsed * this.rotationSpeed + offsetAngle) * radius
      subGroup.position.z = Math.sin(this.time.elapsed * this.rotationSpeed + offsetAngle) * radius
    })
  }
}
