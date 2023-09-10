import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
    constructor () {
        super()

        // Setup
        this.clock = new THREE.Clock()

        this.elapsed = this.clock.getElapsedTime()
        // this.delta = this.clock.getDelta()
    }

    update () {
        this.elapsed = this.clock.getElapsedTime()
        // this.delta = this.clock.getDelta()
    }
}
