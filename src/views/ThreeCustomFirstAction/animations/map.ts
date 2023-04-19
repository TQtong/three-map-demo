
import { gradientRampMaterial, blowMaterial } from '../base/shader'
import * as THREE from 'three'
import { projection, scene, map } from '../base/baseObj'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

/**
 * @description: 初始化目标地图
 * @param {any} jsondata 地图数据
 * @param {any} scene 场景对象
 * @return {*}
 */
export const createTargetMap = (jsondata: any):void => {
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
          color: 'white',
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
        mesh.position.set(0, 0, 0)

        province.add(mesh)
        province.add(line)
        map.add(province)
      })
    })
  })
  scene.add(map)
}

/**
 * @description: 初始化底图
 * @param {any} mapData 地图数据
 * @param {any} scene 场景对象
 * @return {*}
 */
export const createBaseMap = (mapData: any) => {
  mapData.features.forEach((elem: any) => {
    // 定一个省份3D对象
    const province = new THREE.Object3D()

    // 每个的 坐标 数组
    const coordinates = elem.geometry.coordinates
    // 循环坐标数组
    coordinates.forEach((multiPolygon: any) => {
      multiPolygon.forEach((polygon: any) => {
        const shape = new THREE.Shape()
        const lineMaterial = new THREE.LineBasicMaterial({
          side: THREE.DoubleSide,
          depthTest: false,
          color: '#ccc',
          transparent: true,
          opacity: 1
        })

        const lineGeometry = new THREE.BufferGeometry()
        const points = [] as any
        for (let i = 0; i < polygon.length; i++) {
          const [x, y] = projection(polygon[i])
          if (i === 0) {
            shape.moveTo(x, -y)
          }
          shape.lineTo(x, -y)
          points.push(new THREE.Vector3(x, -y, 0))
        }
        lineGeometry.setFromPoints(points)
        const extrudeSettings = {
          depth: 2,
          bevelEnabled: false
        }
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const material = new THREE.MeshBasicMaterial({
          color: '#826c00',
          transparent: true,
          opacity: 1
        })
        const mesh = new THREE.Mesh(geometry, [material, blowMaterial])
        const line = new THREE.Line(lineGeometry, lineMaterial)
        province.properties = elem.properties
        mesh.position.set(0, 0, 0)
        line.position.set(0, 0, 2)
        mesh.name = 'china'
        province.name = 'china'
        province.add(mesh)
        province.add(line)
        map.add(province)
      })
    })
  })
  map.name = 'china'
  map.rotation.x = -Math.PI * 0.5 * 0.5
  // map.scale.x = 0.5 * 0.5
  // map.scale.y = 0.5 * 0.5
  // map.scale.z = 0.5 * 0.5
  scene.add(map)
}

/**
 * @description: 初始化底图
 * @param {any} mapData 地图数据
 * @param {any} scene 场景对象
 * @return {*}
 */
export const displayName = (mapData: any) => {
  const group = new THREE.Group()
  const loader = new FontLoader()

  let preText:any // 上一个字体

  loader.load('fonts/custom_Regular.json', function (font:any) {
    mapData.features.forEach((d: any, i: number) => {
      const lnglat = d.properties.center

      if (lnglat === undefined) {
        return
      }
      const color = 0xffffff
      const [x, y] = projection(lnglat)
      const matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      })

      const shapes = font.generateShapes(d.properties.name, 1)
      console.log(shapes)
      const geometry = new THREE.ShapeGeometry(shapes)

      geometry.computeBoundingBox()
      console.log(geometry.boundingBox)

      // 取中
      const { min, max } = geometry.boundingBox

      if (preText === undefined) {
        preText = geometry.boundingBox
      } else {
        const preMinX = preText.min.x
        const preMaxX = preText.max.x
        const preMinY = preText.min.y
        const preMaxY = preText.max.y
        const preWidth = max.x - min.x // 矩形宽度
        const preHeight = max.y - min.y // 矩形高度

        // if ((preMinX <= min.x && min.x <= preMaxX) && (preMinY <= min.y && min.y <= preMaxY) && (max.x <= preMaxX && max.x <= preMaxX) && (preMinY <= max.y && max.y <= preMaxY)) {

        // }
      }

      const centerX = min.x + max.x / 2
      const centerY = min.y + max.y / 2
      const width = max.x - min.x // 矩形宽度
      const height = max.y - min.y // 矩形高度

      const text = new THREE.Mesh(geometry, matLite)
      text.position.x = (x - centerX)
      text.position.y = -(y - centerY + height)
      text.position.z = 2.3
      group.add(text)
    })
  })

  group.rotation.x = -Math.PI * 0.5 * 0.5
  scene.add(group)
}
