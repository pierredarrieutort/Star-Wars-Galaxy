import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Cube {
  constructor () {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    this.time = this.experience.time

    if (this.debug.active) {
      const axesHelper = new THREE.AxesHelper(3)
      this.scene.add(axesHelper)
    }

    this.starGroups = [
      this.createStar({
        size: .5,
        x: 2,
        z: 7
      }),
      this.createStar({
        size: .5,
        x: 8,
        z: 2
      })
    ]
  }

  createStar (starData) {
    this.setGeometries(starData)
    this.setMaterials()

    const { sphere, lineLoop } = this.createElements()

    const subGroup = new THREE.Group()
    subGroup.position.set(starData.x, 0, starData.z)
    subGroup.add(sphere)

    const parentGroup = new THREE.Group()
    parentGroup.add(lineLoop, subGroup)

    parentGroup.setRotationFromEuler(new THREE.Euler(Math.PI / 8))

    this.scene.add(parentGroup)

    return [parentGroup, starData]
  }

  setGeometries ({ size, x, z }) {
    this.sphereGeometry = new THREE.BoxGeometry(size, 1, 1)

    const maxSize = Math.max(x, z)
    const curve = new THREE.EllipseCurve(0, 0, maxSize, maxSize)

    const pts = curve.getSpacedPoints(256)
    this.lineLoopGeometry = new THREE.BufferGeometry().setFromPoints(pts)
    this.lineLoopGeometry.rotateX(Math.PI / 2)
  }

  setMaterials () {
    this.sphereMaterial = new THREE.MeshLambertMaterial()
    this.lineLoopMaterial = new THREE.LineBasicMaterial({ color: 0xFF00FF })
  }

  createElements () {
    return {
      sphere: new THREE.Mesh(this.sphereGeometry, this.sphereMaterial),
      lineLoop: new THREE.LineLoop(this.lineLoopGeometry, this.lineLoopMaterial)
    }
  }

  update () {
    this.starGroups.forEach(([parentGroup, starData]) => {
      const [lineLoop, subGroup] = parentGroup.children
      const [star] = subGroup.children

      // Rotation continue de la sphère sur elle-même
      star.rotation.x = this.time.elapsed
      star.rotation.y = this.time.elapsed

      const radius = Math.max(starData.x, starData.z) // Rayon de la révolution

      // Calcul de l'angle en fonction de la position initiale de l'élément
      const angle = Math.atan2(starData.z, starData.x)
    
      subGroup.position.x = Math.cos(this.time.elapsed + angle) * radius
      subGroup.position.z = Math.sin(this.time.elapsed + angle) * radius
    })
  }
}
