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

    if (this.debug.active) {
      const axesHelper = new THREE.AxesHelper(25)
      this.scene.add(axesHelper)
    }

    this.rotationSpeed = .05

    this.setMaterials()

    this.sphereGeometry = new THREE.SphereGeometry()

    this.starGroups = cleanedGeoJSON.map(starData => this.createStar(starData))

    this.raycaster.on('raycast', () => this.isStarRaycasted())
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
      .rotateX(Math.PI / 8)
      .userData = starData

    this.scene.add(parentGroup)

    return parentGroup
  }

  setMaterials () {
    this.sphereMaterial = new THREE.MeshLambertMaterial()
    this.lineLoopMaterial = new THREE.LineBasicMaterial({
      color: 0xFF00FF,
      transparent: true,
      opacity: 0.1
    })
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

  isStarRaycasted () {
    const intersects = this.raycaster.intersects
      .find(el => el.object.geometry instanceof THREE.SphereGeometry)

    if (intersects) {
      console.log(
        intersects.object.parent.parent.userData.properties.name,
        intersects.object.parent.parent.userData.geometry.coordinates
      )
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

      // Rotation continue de la sphère autour du centre
      subGroup.position.x = Math.cos(this.time.elapsed * this.rotationSpeed + offsetAngle) * radius
      subGroup.position.z = Math.sin(this.time.elapsed * this.rotationSpeed + offsetAngle) * radius
    })
  }
}
