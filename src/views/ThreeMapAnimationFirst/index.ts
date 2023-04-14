/*
 * @Author: TQtong 2733707740@qq.com
 * @Date: 2023-04-14 08:24:13
 * @LastEditors: TQtong 2733707740@qq.com
 * @LastEditTime: 2023-04-14 15:45:42
 * @FilePath: \three-map-demo\src\views\ThreeMapAnimationFirst\index.ts
 * @Description: main logic
 */
import * as THREE from 'three'
import { gradientRampMaterial } from './composables/shader'
import { projection, map, scene, axes, camera, renderer, control } from './composables/baseObj'
import { createOutLine } from './composables/outline'

scene.add(camera)
scene.add(axes)

renderer.setSize(window.innerWidth, window.innerHeight)

let composer: any

export const initRender = () => {
  composer = createOutLine()
  animate()
}

const animate = () => {
  requestAnimationFrame(animate)

  control.update()
  renderer.render(scene, camera)

  // drawing outLine
  if (composer) {
    composer.render()
  }
}

/**
   * @description:  获取地图要素添加到场景中
   * @param {*} jsondata 地图数据
   * @return {*}
   */
export const setGeometry = (jsondata: any) => {
  // 初始化一个地图对象

  jsondata.features.forEach((elem: any) => {
    // 定一个省份3D对象
    const province = new THREE.Object3D()

    // 每个的 坐标 数组
    const coordinates = elem.geometry.coordinates
    // 循环坐标数组
    coordinates.forEach((multiPolygon: any) => {
      multiPolygon.forEach((polygon: any) => {
        const shape = new THREE.Shape()
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 'green',
          linewidth: 10,
          linecap: 'round', // ignored by WebGLRenderer
          linejoin: 'round' // ignored by WebGLRenderer
        })
        const lineGeometry = new THREE.BufferGeometry()
        const points = [] as any

        for (let i = 0; i < polygon.length; i++) {
          const [x, y] = projection(polygon[i])
          if (i === 0) {
            shape.moveTo(x, -y)
          }
          shape.lineTo(x, -y)
          points.push(new THREE.Vector3(x, -y, 1))
        }
        lineGeometry.setFromPoints(points)

        const extrudeSettings = {
          depth: 1,
          bevelEnabled: false
        }

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const material = new THREE.MeshBasicMaterial({
          color: '#2defff',
          transparent: true,
          opacity: 0.6
        })

        const mesh = new THREE.Mesh(geometry, [material, gradientRampMaterial])
        const line = new THREE.Line(lineGeometry, lineMaterial)
        province.properties = elem.properties
        mesh.position.set(0, 0, 1)
        line.position.set(0, 0, 1)
        province.add(mesh)
        province.add(line)
        map.add(province)
      })
    })
  })
  scene.add(map)
}
