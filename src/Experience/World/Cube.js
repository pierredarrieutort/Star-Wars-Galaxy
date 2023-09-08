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

    this.starGroups = []

    this.createStar({
      size: .5,
      x: 5,
      y: 5
    })
  }

  createStar (starData) {
    this.setGeometries(starData)
    this.setMaterials()

    const { sphere, lineLoop } = this.createElements()

    const subGroup = new THREE.Group()
    subGroup.position.set(starData.x, 0, starData.y)
    subGroup.add(sphere)

    const parentGroup = new THREE.Group()
    parentGroup.add(lineLoop, subGroup)

    parentGroup.setRotationFromEuler(new THREE.Euler(Math.PI / 8))

    this.starGroups.push(parentGroup)

    this.scene.add(parentGroup)
  }

  setGeometries ({ size, x, y }) {
    this.sphereGeometry = new THREE.SphereGeometry(size, 32, 32)


    const curve = new THREE.EllipseCurve(0, 0, x, y)

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
    // Mettez ici la logique de mise à jour pour les rotations et les translations.
    const time = this.time.elapsed * 0.001; // Temps écoulé en secondes
    const rotationSpeed = 0.5; // Vitesse de rotation


    this.starGroups.forEach(group => {
      const subGroup = group.children[1]
      const star = subGroup.children[0]
      
      // Rotation continue de la sphère sur elle-même
      star.rotation.x += rotationSpeed * this.time.delta
      star.rotation.y += rotationSpeed * this.time.delta

      // Translation continue du groupe pour faire une révolution autour du centre
      const radius = 5; // Rayon de la révolution
      const centerX = 0;
      const centerZ = 0;
      const x = radius * Math.cos(time); // Utilisation de trigonométrie pour obtenir la position en x
      const z = radius * Math.sin(time); // Utilisation de trigonométrie pour obtenir la position en z
      subGroup.position.set(centerX + x, 0, centerZ + z);
    })
  }
}
