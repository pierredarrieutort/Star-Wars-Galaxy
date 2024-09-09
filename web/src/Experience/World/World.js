import Experience from '../Experience.js'
import Environment from './Environment.js'
import Planets from './Planets.js'
import Galaxy from './Galaxy.js'

export default class World {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources


        if (this.resources.allResourcesLoaded) {
            this.setupWorld()
        } else {
            // Wait for resources
            this.resources.on('ready', () => this.setupWorld())
        }
    }

    setupWorld () {
        // Setup
        this.planets = new Planets()
        this.environment = new Environment()
        this.galaxy = new Galaxy()
    }

    update () {
        this.planets?.update()
        this.galaxy?.update()
    }
}
