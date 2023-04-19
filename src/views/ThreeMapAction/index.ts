/*
 * @Author: TQtong 2733707740@qq.com
 * @Date: 2023-04-14 09:55:02
 * @LastEditors: TQtong 2733707740@qq.com
 * @LastEditTime: 2023-04-18 20:29:18
 * @FilePath: \three-map-demo\src\views\ThreeMapActionSecond\index.ts
 * @Description: Map
 */
import * as THREE from 'three'
import { scene, camera, renderer, control, axes } from './composables/baseObj'
import { circleAnimation, InintLightCross } from './composables/CircleAction'
import { getJsonNanJingData, getJsonChinaData } from '@/api/index'
import { initBaseMap, initTargetMap } from './composables/map'
import { InitAureole } from './composables/aureole'
import { createHalo } from './composables/halo'
import { createVideoAnimation } from './composables/video'
import { commonUniforms, initCircleCurveGroup, createFlyLine, randomVec3Color } from './composables/routationLine'
import { stats, gui } from './composables/datGUI'

const clock = new THREE.Clock() // 时间
const raycaster = new THREE.Raycaster() // 射线追踪
const mouse = new THREE.Vector2() // 鼠标对象

const ambientLight = new THREE.AmbientLight(101070, 20)
scene.add(ambientLight) // 环境

scene.add(axes)

camera.position.set(0, 0, 15)
camera.lookAt(scene.position)

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.useLegacyLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.sortObjects = true

const params = {
  exposure: 1,
  bloomStrength: 0.35,
  bloomThreshold: 0,
  bloomRadius: 0
}

const colorObj = {
  color: '#00ff51',
  tcolor: '#006dff'
}

const guiAdd = gui.addFolder('基础')
guiAdd.add(params, 'exposure', 0.1, 2).onChange((value: any) => {
  renderer.toneMappingExposure = Math.pow(value, 4.0)
})

// guiAdd.add(params, 'bloomThreshold', 0.0, 1.0).onChange((value: any) => {
//   bloomPass.threshold = Number(value)
// })
// guiAdd.add(params, 'bloomStrength', 0.0, 3.0).onChange((value: any) => {
//   bloomPass.strength = Number(value)
// })
// guiAdd.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange((value: any) => {
//   bloomPass.radius = Number(value)
// })
guiAdd.addColor(colorObj, 'color').onChange((value: any) => {
  const element = scene.children.find((elem: any) => elem.name === 'china')
  const result = element.children.filter((elem: any) => elem.name === 'china')
  result.forEach((item:any) => {
    const target = item.children.find((elem: any) => elem.name === 'china')
    target.material.uniforms.u_color.value = new THREE.Color(value)
  })
})
guiAdd.addColor(colorObj, 'tcolor').onChange((value: any) => {
  const element = scene.children.find((elem: any) => elem.name === 'china')
  const result = element.children.filter((elem: any) => elem.name === 'china')
  result.forEach((item:any) => {
    const target = item.children.find((elem: any) => elem.name === 'china')
    target.material.uniforms.u_tcolor.value = new THREE.Color(value)
  })
})

let lastPick:any
let tip: any
let composer: any
const ENTIRE_SCENE = 0; const BLOOM_SCENE = 1
const bloomLayer = new THREE.Layers()
bloomLayer.set(BLOOM_SCENE)
const materials = {} as any

export const init = async (tooltip:any) => {
  const myMapData = await getJsonNanJingData()
  const chinaData = await getJsonChinaData()
  const curves = initCircleCurveGroup(10, 150, 150)

  for (const curve of curves) {
    createFlyLine(curve, {
      speed: 0.2,
      number: Math.floor(Math.random() * 9 + 1),
      color: randomVec3Color(),
      size: 4.0
    }, 18000, 1, { x: 0, y: 0, z: 0 })
  }
  initBaseMap(chinaData)
  initTargetMap(myMapData)
  InintLightCross(myMapData)
  InitAureole(myMapData)
  createVideoAnimation()
  composer = createHalo()
  // 获取鼠标当前位置
  window.addEventListener('pointermove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    // 更改div位置
    tooltip.style.left = event.clientX + 2 + 'px'
    tooltip.style.top = event.clientY + 2 + 'px'
    tip = tooltip
  })
  animate()
}

const animate = () => {
  requestAnimationFrame(animate)
  stats.begin()
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)
  // 算出射线 与当场景相交的对象有那些
  const intersects = raycaster.intersectObjects(scene.children, true)

  if (lastPick) {
    lastPick.object.material[0].color.set('#2defff')
    // lastPick.object.material[1].uniforms.u_color.set('#3480C4')
  }
  lastPick = intersects.find(
    (item: any) => item.object.material && item.object.material.length === 2
  )
  if (lastPick) {
    lastPick.object.material[0].color.set(0xff0000)
    // lastPick.object.material[1].uniforms.u_color.set(0xff0000)
  }
  commonUniforms.u_time.value += 0.01
  showTip()
  const dalte = clock.getDelta()
  circleAnimation(dalte)
  control.update()
  // renderer.render(scene, camera)
  // if (composer) {
  //   composer.render()
  // }
  scene.traverse(darkenNonBloomed)
  composer.bloomComposer.render()
  scene.traverse(restoreMaterial)
  composer.finalComposer.render()
  stats.end()
}

const showTip = () => {
  if (tip === undefined) {
    return
  }
  // 显示信息
  if (lastPick) {
    const properties = lastPick.object.parent.properties

    tip.textContent = properties.name
    tip.style.display = 'block'
  } else {
    tip.style.display = 'none'
  }
}

const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' })
function darkenNonBloomed (obj:any) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material
    obj.material = darkMaterial
  }
}

function restoreMaterial (obj:any) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid]
    delete materials[obj.uuid]
  }
}
