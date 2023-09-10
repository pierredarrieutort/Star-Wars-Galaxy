import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor () {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance () {
        this.instance = new THREE.PerspectiveCamera(60, this.sizes.width / this.sizes.height, 0.1, 10000)
        this.instance.position.set(111, 27, 80)
        this.instance.rotation.set(-0.32880510859616985, 0.9188469117645457, 0.26484212369454485)
        this.scene.add(this.instance)
    }

    setControls () {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize () {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update () {
        this.controls.update()
    }
}
