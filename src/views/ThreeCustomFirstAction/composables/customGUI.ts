/*
 * @Author: TQtong 2733707740@qq.com
 * @Date: 2023-04-18 19:09:43
 * @LastEditors: TQtong 2733707740@qq.com
 * @LastEditTime: 2023-04-23 15:14:08
 * @FilePath: \three-map-demo\src\views\ThreeCustomFirstAction\composables\customGUI.ts
 * @Description: gui service
 */
import { scene, renderer } from '@/base/baseObj'
import * as THREE from 'three'
import { gui } from '@/base/datGUI'

const params = {
  exposure: 1,
  bloomStrength: 0.35,
  bloomThreshold: 0,
  bloomRadius: 0
}

const colorObj = {
  upColor: '#002642',
  downColor: '#00abad',
  tcolor: '#c8ff00'
}

/**
 * @description: init gui
 * @param {*} void
 * @return {*}
 */
export const initGUI = (): void => {
  const guiAdd = gui.addFolder('基础')
  guiAdd.add(params, 'exposure', 0.1, 2).onChange((value: any) => {
    renderer.toneMappingExposure = Math.pow(value, 4.0)
  })

  guiAdd.addColor(colorObj, 'upColor').onChange((value: any) => {
    console.log(scene)
    const element = scene.children.find((elem: any) => elem.name === 'china')
    const result = element.children.filter((elem: any) => elem.name === 'china')
    result.forEach((item:any) => {
      const target = item.children.find((elem: any) => elem.name === 'china')
      // target.material.uniforms.u_color.value = new THREE.Color(value)
      target.material[0].color = new THREE.Color(value)
    })
  })

  guiAdd.addColor(colorObj, 'downColor').onChange((value: any) => {
    console.log(scene)
    const element = scene.children.find((elem: any) => elem.name === 'china')
    const result = element.children.filter((elem: any) => elem.name === 'china')
    result.forEach((item:any) => {
      const target = item.children.find((elem: any) => elem.name === 'china')
      target.material[1].uniforms.u_color.value = new THREE.Color(value)
    })
  })

  guiAdd.addColor(colorObj, 'tcolor').onChange((value: any) => {
    const element = scene.children.find((elem: any) => elem.name === 'china')
    const result = element.children.filter((elem: any) => elem.name === 'china')
    result.forEach((item:any) => {
      const target = item.children.find((elem: any) => elem.name === 'china')
      target.material[1].uniforms.u_tcolor.value = new THREE.Color(value)
    })
  })
}
