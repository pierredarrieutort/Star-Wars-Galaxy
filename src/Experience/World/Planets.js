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

    if (this.debug.active) {
      const axesHelper = new THREE.AxesHelper(3)
      this.scene.add(axesHelper)
    }

    // cleanedGeoJSON.length = 10
    // console.log(cleanedGeoJSON[0].geometry.coordinates)
    // console.log(cleanedGeoJSON.map(el => el.geometry.coordinates))

    // this.starGroups = cleanedGeoJSON.map(el => {
    //   const [x, z] = el.geometry.coordinates

    //   return this.createStar({
    //     size: .5,
    //     x: x,
    //     z: z
    //   })
    // })

    this.starGroups = [
      // this.createStar({
      //   size: 3,
      //   x: 60,
      //   z: 120
      // }),
      this.createStar({
        size: 3,
        x: 70,
        z: 90
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

    parentGroup.rotateX(Math.PI / 8)

    this.scene.add(parentGroup)

    // Calcul de l'angle en fonction de la position initiale de l'élément
    starData.offsetAngle = Math.atan2(starData.z, starData.x)

    return [parentGroup, starData]
  }

  setGeometries (starData) {
    const { size, x, z } = starData

    this.sphereGeometry = new THREE.BoxGeometry(size, size, size)

    const hypotenuse = Math.sqrt(x ** 2 + z ** 2)
    starData.radius = hypotenuse

    const curve = new THREE.EllipseCurve(0, 0, hypotenuse, hypotenuse)

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

      // Rotation continue de la sphère autour du centre
      subGroup.position.x = Math.cos(this.time.elapsed + starData.offsetAngle) * starData.radius
      subGroup.position.z = Math.sin(this.time.elapsed + starData.offsetAngle) * starData.radius
    })
  }
}
