import { createOutLine } from '../animations/halo'
import { mouse, raycaster, camera, scene } from '@/base/baseObj'
import { ref } from 'vue'
import { showGaugePoint, visibleGaugePoint } from './loadGaugePoint'

const lastPick = ref()

export const pointerMoveEvent = (tooltip:any): void => {
  // 获取鼠标当前位置
  window.addEventListener('pointerdown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    // 更改div位置
    tooltip.style.left = event.clientX + 2 + 'px'
    tooltip.style.top = event.clientY + 2 + 'px'

    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(mouse, camera)

    // 算出射线 与当场景相交的对象有那些
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (lastPick.value) {
      lastPick.value.object.material[0].color.set('#002642')
      // lastPick.object.material[1].uniforms.u_color.set('#3480C4')
    }
    lastPick.value = intersects.find(
      (item: any) => item.object.material && item.object.material.length === 2
    )
    if (lastPick.value) {
      console.log(lastPick.value)
      lastPick.value.object.material[0].color.set('#02fad4')
      // lastPick.object.material[1].uniforms.u_color.set(0xff0000)
      createOutLine([lastPick.value.object.parent])
      showGaugePoint(lastPick.value)
    } else {
      createOutLine([])
      visibleGaugePoint()
    }

    // 显示信息
    if (lastPick.value) {
      const properties = lastPick.value.object.parent.properties

      tooltip.textContent = properties.name
      tooltip.style.display = 'block'
    } else {
      tooltip.style.display = 'none'
    }
  })
}
