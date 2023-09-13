import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
    constructor () {
        super()

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        this._internalResizeReference = () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        }

        // Resize event
        window.addEventListener('resize', this._internalResizeReference, { passive: true })
    }

    destroy () {
        window.removeEventListener('resize', this._internalResizeReference, { passive: true })
        this.off('resize')
    }
}
