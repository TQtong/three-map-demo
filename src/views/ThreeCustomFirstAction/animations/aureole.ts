import * as THREE from 'three'
import { scene, projection } from '../base/baseObj'
import gsap from 'gsap'

/**
 * @description: create aureole
 * @param {any} data place info
 * @return {*}
 */
export const createAureole = (data:any): void => {
  const group = new THREE.Group()
  data.features.forEach((d: any) => {
    const lnglat = d.properties.center

    if (lnglat === undefined) {
      return
    }

    const [x, y] = projection(lnglat)

    const circlePlane = new THREE.PlaneGeometry(1, 1)
    const circleTexture = new THREE.TextureLoader().load('./images/label.png')
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: '#00ffdd',
      map: circleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })

    const circleMesh = new THREE.Mesh(circlePlane, circleMaterial)
    circleMesh.position.set(x, -y, 2)

    group.add(circleMesh)

    gsap.to(circleMesh.scale, {
      duration: 1 + Math.random() * 0.5,
      x: 2,
      y: 2,
      z: 2,
      repeat: -1,
      delay: Math.random() * 0.5,
      yoyo: true,
      ease: 'power2.inOut'
    })
  })

  group.rotation.x = -Math.PI * 0.5 * 0.5

  scene.add(group)
}
