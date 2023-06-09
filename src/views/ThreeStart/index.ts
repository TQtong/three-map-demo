/*
 * @Author: TQtong 2733707740@qq.com
 * @Date: 2023-04-14 07:37:20
 * @LastEditors: TQtong 2733707740@qq.com
 * @LastEditTime: 2023-04-21 17:40:08
 * @FilePath: \three-map-demo\src\views\ThreeStart\index.ts
 * @Description: logic center
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)

const scene = new THREE.Scene()
scene.add(mesh)

const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

const axes = new THREE.AxesHelper(5)
scene.add(axes)

export const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

export const control = new OrbitControls(camera, renderer.domElement)

export const animate = () => {
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}
