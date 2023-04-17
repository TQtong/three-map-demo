import * as THREE from 'three'
import { scene, axes, camera, renderer, control } from './composables/baseObj'
import { createVideoAnimation } from './composables/video'
import { createHalo } from './composables/halo'
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
const mesh = new THREE.Mesh(geometry, material)

scene.add(camera)
scene.add(axes)
scene.add(mesh)
scene.add(new THREE.AmbientLight(0x404040))

renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.shadowMap.enabled = true
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.useLegacyLights = true
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 1
// renderer.sortObjects = true

export const initRender = () => {
  createVideoAnimation()
  animate()
}
const animate = () => {
  control.update()
  renderer.render(scene, camera)
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  // drawing outLine
  //   if (bloomComposer) {
  //     bloomComposer.render()
  //   }
  requestAnimationFrame(animate)
}
