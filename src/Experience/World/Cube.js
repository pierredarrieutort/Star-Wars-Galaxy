import * as THREE from 'three'
import Experience from '../Experience.js'
import Stats from 'three/addons/libs/stats.module.js'

export default class Cube {
  constructor () {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // Debug

    this.debugApi = {
      count: 1000,
      gpuMemory: 0
    }

    this.stats = new Stats()

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('environment')

      this.debugFolder
        .add(this.debugApi, 'count')
        .min(1)
        .max(10000)
        .step(1)
        .onChange(() => this.initMesh())
      
      this.debugFolder
        .add(this.debugApi, 'gpuMemory')
        .name('GPU memory')
        .listen()
        .disable()
    }

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
      
    this.initMesh()
  }

  setGeometry () {
    this.geometry = new THREE.BoxGeometry(1, 1, 1)
  }

  setMaterial () {
    this.material = new THREE.MeshLambertMaterial()
  }

  setMesh () {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = - Math.PI * 0.5
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }



  initMesh () {
    this.cleanMeshes()
    this.makeInstanced()
  }


  cleanMeshes () {
    const meshes = []

    this.scene.traverse(object => {
      if (object.isMesh)
        meshes.push(object)
    })

    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i]
      mesh.material.dispose()
      mesh.geometry.dispose()

      this.scene.remove(mesh)
    }
  }

  update () {
    this.stats.update()
  }

  makeInstanced () {
    const mesh = new THREE.InstancedMesh(this.geometry, this.material, this.debugApi.count);
  
    for (let i = 0; i < this.debugApi.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * 40 - 20,
        Math.random() * 40 - 20,
        Math.random() * 40 - 20
      );
  
      const quaternion = new THREE.Quaternion().random();
  
      const scale = new THREE.Vector3(
        Math.random(),
        Math.random(),
        Math.random()
      );
  
      const matrix = new THREE.Matrix4();
      matrix.compose(position, quaternion, scale);
  
      mesh.setMatrixAt(i, matrix);
    }
  
    this.scene.add(mesh);
  
    const geometryByteLength = this.getGeometryByteLength(this.geometry);
    this.debugApi.gpuMemory = this.formatBytes(this.debugApi.count * 16 + geometryByteLength, 2)
  }
  

  getGeometryByteLength = () => {
    let total = 0

    if (this.geometry.index)
      total += this.geometry.index.array.byteLength;

    for (const name in this.geometry.attributes) {
      total += this.geometry.attributes[name].array.byteLength;
    }

    return total
  }

  formatBytes = (bytes, decimals) => {
    if (bytes === 0)
      return '0 bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['bytes', 'KB', 'MB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
}
