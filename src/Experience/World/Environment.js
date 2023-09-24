import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment')

            this.sunLightHelper = null
            this.isDisplayedSunLightHelper = true
        }

        this.setSunLight()
    }

    setSunLight () {
        this.sunLight = new THREE.PointLight('#ffffff', 100, 0, 1)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.scene.add(this.sunLight)

        // Debug
        if (this.debug.active) {
            this.showSunLightHelper()

            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001)
        }
    }

    showSunLightHelper () {
        const setSunLightHelper = () => {
            this.sunLightHelper = new THREE.PointLightHelper(this.sunLight, 1)
            this.scene.add(this.sunLightHelper)
        }

        const destroySunLightHelper = () => {
            this.scene.remove(this.sunLightHelper)
            this.sunLightHelper = null
        }

        if (this.isDisplayedSunLightHelper) {
            setSunLightHelper()
        }

        this.debugFolder
            .add(this, 'isDisplayedSunLightHelper')
            .name('Show Sunlight Helper')
            .onChange(bool => bool ? setSunLightHelper() : destroySunLightHelper())
    }
}
