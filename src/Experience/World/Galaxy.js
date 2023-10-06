import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Galaxy {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.renderer = this.experience.renderer
        this.time = this.experience.time

        this.parameters = {
            count: 200000,
            size: .0005,
            radius: 75,
            branches: 3,
            spin: 1,
            randomness: .5,
            randomnessPower: 3,
            insideColor: '#ff6030',
            outsideColor: '#1b3984'
        }

        this.galaxyBaseAge = 500

        this.geometry = null
        this.material = null
        this.points = null


        this.generateGalaxy()

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Galaxy')

            this.debugFolder
                .add(this.parameters, 'count')
                .min(100)
                .max(1000000)
                .step(100)
                .onFinishChange(() => this.generateGalaxy())

            this.debugFolder
                .add(this.parameters, 'radius')
                .min(0.01)
                .max(250)
                .step(0.01)
                .onFinishChange(() => this.generateGalaxy())

            this.debugFolder
                .add(this.parameters, 'branches')
                .min(2)
                .max(10)
                .step(1)
                .onFinishChange(() => this.generateGalaxy())

            this.debugFolder
                .add(this.parameters, 'randomness')
                .min(0)
                .max(2)
                .step(0.001)
                .onFinishChange(() => this.generateGalaxy())

            this.debugFolder
                .add(this.parameters, 'randomnessPower')
                .min(1)
                .max(10)
                .step(0.001)
                .onFinishChange(() => this.generateGalaxy())

            this.debugFolder
                .addColor(this.parameters, 'insideColor')
                .onFinishChange(() => this.generateGalaxy())

            this.debugFolder
                .addColor(this.parameters, 'outsideColor')
                .onFinishChange(() => this.generateGalaxy())
        }
    }

    generateGalaxy () {
        if (this.points !== null) {
            this.geometry.dispose()
            this.material.dispose()
            this.scene.remove(this.points)
        }

        /**
         * Geometry
         */
        this.geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(this.parameters.count * 3)
        const colors = new Float32Array(this.parameters.count * 3)
        const scales = new Float32Array(this.parameters.count)
        const randomness = new Float32Array(this.parameters.count * 3)

        const insideColor = new THREE.Color(this.parameters.insideColor)
        const outsideColor = new THREE.Color(this.parameters.outsideColor)

        for (let i = 0; i < this.parameters.count; i++) {
            const i3 = i * 3

            // Position
            const radius = Math.random() * this.parameters.radius

            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2

            positions[i3] = Math.cos(branchAngle) * radius
            positions[i3 + 1] = 0
            positions[i3 + 2] = Math.sin(branchAngle) * radius

            // Randomness

            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius

            randomness[i3] = randomX
            randomness[i3 + 1] = randomY
            randomness[i3 + 2] = randomZ

            // Color
            const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / this.parameters.radius)

            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            scales[i] = Math.random()
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
        this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))

        /**
         * Material
         */
        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            uniforms: {
                uTime: { value: this.galaxyBaseAge },
                uSize: { value: 1000 * this.renderer.instance.getPixelRatio() }
            },
            vertexShader: this.resources.items.GalaxyShaderVertex,
            fragmentShader: this.resources.items.GalaxyShaderFragment
        })

        /**
         * Points
         */
        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }

    update () {
        this.material.uniforms.uTime.value = this.time.elapsed + this.galaxyBaseAge
    }
}
