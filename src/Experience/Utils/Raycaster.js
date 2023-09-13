import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

export default class Raycaster extends EventEmitter {
  constructor () {
    super()

    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance


    // Gestionnaires d'événements pour la souris
    this.instance = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.intersects = []

    // "this._internalRaycastReference" is used to make a save of the
    // function reference and keep binding to properly destroy it if necessary.
    this._internalRaycastReference = e => {
      this.raycast(e)
      this.trigger('raycast')
    }

    window.addEventListener('mousemove', this._internalRaycastReference, { passive: true })
  }
  

  raycast (e) {
    // Calculez la position normalisée de la souris
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    // Mettez à jour le rayon de la souris
    this.instance.setFromCamera(this.mouse, this.camera)

    // Vérifiez s'il y a une intersection entre le rayon et le mesh
    this.intersects = this.instance.intersectObject(this.scene, true)
  }

  destroy () {
    window.removeEventListener('mousemove', this._internalRaycastReference, { passive: true })
    this.off('raycast')
  }
}
