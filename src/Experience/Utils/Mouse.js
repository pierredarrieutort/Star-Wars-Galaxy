import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Mouse extends EventEmitter {
  constructor () {
    super()
    
    this.experience = new Experience()
    this.canvas = this.experience.canvas

    this.instance = {
      clientX: 0,
      clientY: 0
    }

    this._internalMouseMoveReference = e => {
      this.instance = e
      this.trigger('mousemove')
    }

    this._internalClickReference = e => {
      this.instance = e
      this.trigger('click')
    }

    this.canvas.addEventListener('mousemove', this._internalMouseMoveReference, { passive: true })
    this.canvas.addEventListener('click', this._internalClickReference, { passive: true })
  }

  destroy () {
    this.canvas.removeEventListener('mousemove', this._internalMouseMoveReference, { passive: true })
    this.canvas.removeEventListener('click', this._internalClickReference, { passive: true })
  }
}
