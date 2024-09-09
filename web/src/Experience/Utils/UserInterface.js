import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class UserInterface extends EventEmitter {
  constructor () {
    super()

    this.experience = new Experience()
    this.raycaster = this.experience.raycaster
    this.debug = this.experience.debug

    this.ui = document.getElementById('ui')

    // Debug
    if (this.debug.active) {
      this.isUIDisabled = true

      this.debug.generalSettings
        .add(this, 'isUIDisabled')
        .name('Disable UI')
        .onChange(() => this.ui.innerHTML = '')
    }

    this.raycaster.on('hydrateUI', data => {
      if (this.isUIDisabled) {
        this.ui.innerHTML = ''
      } else {
        const content = `
          ${data.atmosphere ? `<li>${data.atmosphere}</li>` : ''}
          ${data.description ? `<li>${data.description}</li>` : ''}
          ${data.diameter ? `<li>${data.diameter}</li>` : ''}
          ${data.isCanon ? `<li>${data.isCanon}</li>` : ''}
          ${data.isLegends ? `<li>${data.isLegends}</li>` : ''}
          ${data.moons ? `<li>${data.moons}</li>` : ''}
          ${data.stars ? `<li>${data.stars}</li>` : ''}
          ${data.type ? `<li>${data.type}</li>` : ''}
          ${data.wikiLink ? `<li>${data.wikiLink}</li>` : ''}
        `.trim()

        this.ui.innerHTML = `
          <button onclick="window.experience.raycaster.unfocusClickableElement()">X</button>
          <p class="title">${data.name}</p>
          ${content ? `<ul class="content">${content}</ul>` : ''}
        `
      }
    })
  }
}
