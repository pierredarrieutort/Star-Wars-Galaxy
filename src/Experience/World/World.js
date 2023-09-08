import Experience from '../Experience.js'
import Environment from './Environment.js'
import Cube from './Cube.js'

export default class World {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources


        if (this.resources.allResourcesLoaded) {
            this.setupWorld()
        } else {
            // Wait for resources
            this.resources.on('ready', this.setupWorld)
        }
    }

    setupWorld () {
        // Setup
        this.cube = new Cube()
        this.environment = new Environment()
    }

    update () {
        this.cube?.update()
    }
}
