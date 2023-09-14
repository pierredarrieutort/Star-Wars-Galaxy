import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

export default class Raycaster extends EventEmitter {
  constructor () {
    super()

    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.canvas = this.experience.canvas


    // Gestionnaires d'événements pour la souris
    this.instance = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.intersects = []

    this.clickableInstances = [
      THREE.SphereGeometry
    ]

    // "this._internalRaycastReference" is used to make a save of the
    // function reference and keep binding to properly destroy it if necessary.
    this._internalRaycastReference = e => {
      this.raycast(e)
      this.trigger('click-raycast', [e])
    }
    this._internalMouseMoveRaycastReference = e => {
      this.raycast(e)
      this.trigger('mousemove-raycast')
    }

    this.on('mousemove-raycast', () => {
      const isClickable = this.isClickableElement()

      this.setCursorStyle(isClickable && 'pointer')
    })
    this.on('click-raycast', () => {
      this.isClickedClickableElement()
    })


    window.addEventListener('mousemove', this._internalMouseMoveRaycastReference, { passive: true })
    window.addEventListener('click', this._internalRaycastReference, { passive: true })

  }

  isClickableElement () {
    return this.intersects.find(el => {
      for (const classReference of this.clickableInstances) {
        if (el.object.geometry instanceof classReference) {
          return el
        }
      }
    })
  }

  setCursorStyle (style = 'default') {
    this.canvas.style.cursor = style
  }

  isClickedClickableElement () {
    const intersectedElement = this.isClickableElement()

    if (intersectedElement) {
      this.camera.followingMesh = intersectedElement.object.parent

      console.log(
        intersectedElement.object.parent.parent.userData.properties.name,
        intersectedElement.object.parent.parent.userData
      )
    } else if (this.camera.followingMesh) {
      this.camera.resetCameraToWorldCenter()
    }
  }


  raycast (e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    this.instance.setFromCamera(this.mouse, this.camera.instance)

    this.intersects = this.instance.intersectObject(this.scene, true)
  }

  destroy () {
    window.removeEventListener('mousemove', this._internalMouseMoveRaycastReference, { passive: true })
    window.removeEventListener('click', this._internalRaycastReference, { passive: true })
    this.off('mousemove-raycast')
    this.off('click-raycast')
  }
}
