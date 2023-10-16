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
    this.mouse = this.experience.mouse

    this.instance = new THREE.Raycaster()

    this.clickableInstances = [
      THREE.SphereGeometry
    ]

    this.mouse.on('click', () => this.clickRaycasting())
    this.mouse.on('mousemove', () => this.mousemoveRaycasting())
  }

  clickRaycasting () {
    const isClickable = this.isClickableElementAtPosition()
    this.handleClickedClickableElement(isClickable)
  }

  mousemoveRaycasting () {
    const isClickable = this.isClickableElementAtPosition()

    if (isClickable) {
      this.setCursorStyle('pointer')
      this.trigger('hydrateUI', [isClickable.object.parent.parent.userData.properties])
    } else {
      this.setCursorStyle()
    }
  }

  isClickableElementAtPosition () {
    const tempRaycast = this.getIntersectedElements()

    return this.isClickableElement(tempRaycast)
  }

  isClickableElement (intersectedElements) {
    return intersectedElements.find(el => {
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

  handleClickedClickableElement (clickableElement) {
    if (clickableElement) {
      this.camera.followingMesh = clickableElement.object.parent
    }
    // else if (this.camera.followingMesh) {
    //   this.unfocusClickableElement()
    // }
  }

  unfocusClickableElement () {
    window.experience.userInterface.ui.innerHTML=''
    this.camera.resetCameraToWorldCenter()
  }

  getIntersectedElements () {
    const mousePosition = new THREE.Vector2()

    mousePosition.x = (this.mouse.instance.clientX / window.innerWidth) * 2 - 1
    mousePosition.y = -(this.mouse.instance.clientY / window.innerHeight) * 2 + 1

    this.instance.setFromCamera(mousePosition, this.camera.instance)

    return this.instance.intersectObject(this.scene, true)
  }

  destroy () {
    this.off('mousemove')
    this.off('click')
  }
}
