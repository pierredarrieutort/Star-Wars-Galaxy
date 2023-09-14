import * as dat from 'lil-gui'
import Stats from 'three/addons/libs/stats.module.js'
import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Debug {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.active = window.location.hash === '#debug'

        if (this.active) {
            this.ui = new dat.GUI()

            this.AxesHelper = null

            this.options = {
                showAxesHelper: true
            }

            this.generalSettings = this.ui.addFolder('General settings')

            this.showStatsPanel()
            this.showAxesHelper()
        }
    }

    showStatsPanel () {
        this.stats = new Stats()
        this.stats.showPanel(2) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)
    }

    showAxesHelper () {
        const setAxesHelper = () => {
            this.axesHelper = new THREE.AxesHelper(25)
            this.scene.add(this.axesHelper)
        }

        const destroyAxesHelper = () => {
            this.scene.remove(this.axesHelper)
            this.axesHelper = null
        }

        if (this.options.showAxesHelper) {
            setAxesHelper()
        }

        this.generalSettings
            .add(this.options, 'showAxesHelper')
            .name('Show Axes Helper')
            .onChange(bool => bool ? setAxesHelper() : destroyAxesHelper())
    }

    update () {
        this.stats?.update()
    }
}
