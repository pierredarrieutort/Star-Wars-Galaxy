import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'

export default class Mouse extends EventEmitter {
  constructor () {
    super()

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

    window.addEventListener('mousemove', this._internalMouseMoveReference, { passive: true })
    window.addEventListener('click', this._internalClickReference, { passive: true })
  }

  destroy () {
    window.removeEventListener('mousemove', this._internalMouseMoveReference, { passive: true })
    window.removeEventListener('click', this._internalClickReference, { passive: true })
  }
}
