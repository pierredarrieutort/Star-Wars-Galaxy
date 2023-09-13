import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor () {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.controlsTarget = new THREE.Vector3(0, 0, 0)
        this.lerpSpeed = 0.05
        this.followingMesh = null

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
        this.followingMesh = null
        this.controls.target = new THREE.Vector3()
        this.instance.zoom = 1
        this.instance.updateProjectionMatrix()
    }

    update () {
        if (this.followingMesh) {
            this.followMesh()
        }

        this.controls.update()
    }
}
