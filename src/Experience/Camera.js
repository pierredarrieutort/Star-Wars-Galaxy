import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor () {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.controlsTarget = new THREE.Vector3()
        this.lerpSpeed = 0.05
        this.followingMesh = null
        this.resettingControlsToWorldCenter = false

        this.setInstance()
        this.setControls()
    }

    setInstance () {
        this.instance = new THREE.PerspectiveCamera(60, this.sizes.width / this.sizes.height, 0.1, 10000)
        this.instance.position.set(111, 27, 80)
        this.scene.add(this.instance)
    }

    setControls () {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.target = this.controlsTarget
    }

    resize () {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    followMesh () {
        // Set a dummy vector to store mesh position.
        const targetPosition = new THREE.Vector3()
        this.followingMesh.getWorldPosition(targetPosition)

        // Interpolate controlsTarget position with targetPosition.
        this.controlsTarget.lerp(targetPosition, this.lerpSpeed)

        if (this.instance.zoom < 15) {
            this.instance.zoom += this.lerpSpeed
            this.instance.updateProjectionMatrix()
        }
    }

    resetCameraToWorldCenter () {
        this.resettingControlsToWorldCenter = true
        this.followingMesh = null

        if (this.instance.zoom > 1) {
            this.instance.zoom -= this.lerpSpeed
            this.controlsTarget.lerp(this.controls.target0, this.lerpSpeed)
            this.instance.position.lerp(this.controls.position0, this.lerpSpeed)
            this.instance.updateProjectionMatrix()
        } else {
            const { x, y, z } = this.controlsTarget
            // Check if the center is visually reached, then consider camera is properly reseted.
            if (Math.abs(~~x) + Math.abs(~~y) + Math.abs(~~y) < 1) {
                // Normalize the vectors to 0.
                this.controlsTarget.normalize()
                // Confirm the reset is not anymore active.
                this.resettingControlsToWorldCenter = false
            }
        }
    }

    update () {
        if (this.followingMesh) {
            this.followMesh()
        } else if (this.resettingControlsToWorldCenter) {
            this.resetCameraToWorldCenter()
        }

        this.controls.update()
    }
}
