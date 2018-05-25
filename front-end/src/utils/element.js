
export default {
  isDescendant: (parent, child) => {
    let node = child
    while (node !== null) {
      if (node === parent) {
        return true
      }
      node = node.parentNode
    }
    return false
  },
  offsetBetween: (parent, child) => {
    let offset = {
      left: 0,
      top: 0
    }
    var node = child
    while (node !== null) {
      if (node === parent) {
        return offset
      }
      offset.left += node.offsetLeft
      offset.top += node.offsetTop
      node = node.offsetParent
    }
    return null
  }
}
