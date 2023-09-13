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

    // window.addEventListener('mousemove', this._internalRaycastReference, { passive: true })
    window.addEventListener('click', this._internalRaycastReference, { passive: true })
  }
  

  raycast (e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    this.instance.setFromCamera(this.mouse, this.camera)

    this.intersects = this.instance.intersectObject(this.scene, true)
  }

  destroy () {
    // window.removeEventListener('mousemove', this._internalRaycastReference, { passive: true })
    window.removeEventListener('click', this._internalRaycastReference, { passive: true })
    this.off('raycast')
  }
}
