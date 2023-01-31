const drag = {
  beforeMount(el) {
    const div = el // 当前元素
    let minTop = div.getAttribute('drag-min-top') // 极限距离
    minTop = minTop ? minTop : 0
    div.onmousedown = (e) => {
      let target = div
      // 最顶层元素需要设置绝对定位
      while (
        window.getComputedStyle(target).position !== 'absolute' &&
        target !== document.body
      ) {
        target = target.parentElement
      }

      /**   鼠标按下，计算当前元素距离可视区的距离
       * offsetLeft: 当前元素相对于父元素左边的偏移量
       * clientX: 目标点距离浏览器可视范围的 X轴坐标
       */
      const disX = e.clientX - target.offsetLeft
      const disY = e.clientY - target.offsetTop

      document.onselectstart = () => {
        return false
      }
      document.onmousemove = (e) => {
        // 算移动的距离
        // 因为浏览器里并不能直接取到并且使用clientX、clientY,所以使用事件委托在内部做完赋值
        const l = e.clientX - disX
        const t = e.clientY - disY
        // 计算移动当前元素的位置，并且给该元素样式中的 left和 top值赋值
        target.style.left = (l < minTop ? minTop : l > 475 ? 475 : l) + 'px'
        target.style.top = (t < minTop ? minTop : t) + 'px'
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
        document.onselectstart = null
      }
      // return false不加的话可能导致黏连，拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
      return false
    }
  }
}

export default drag
