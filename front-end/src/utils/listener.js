import utilPlatform from '@/utils/platforms.js'
import utilElement from '@/utils/element.js'

let ratioFloatWindowCode = 480 / 1024
let ratioFloatWindowVideo = 480 / 1024
let sizeFixWindowCode = {
  width: 1024,
  height: 576
}
let sizeFixWindowVideo = {
  width: 1024,
  height: 576
}

let tabReplayLive

const positionAfterDrop = (event, isDescendantOfFixWindow) => {
  let viewBox = document.querySelector('.view-box')
  let floatWindow = document.querySelector('.float-window')
  let dragBar = document.querySelector('.drag-bar')

  let isDescendantOfContent = utilElement.isDescendant(floatWindow.children[1], event.target)
  // Offset between drop targe and view box
  let offsetTarget
  if (isDescendantOfFixWindow) {
    // In the scope of fix window
    offsetTarget = utilElement.offsetBetween(viewBox, event.target)
  } else {
    // In the scope of float window
    offsetTarget = utilElement.offsetBetween(viewBox, floatWindow)
  }
  const dragOffsetX = event.dataTransfer.getData('dragOffsetX')
  const dragOffsetY = event.dataTransfer.getData('dragOffsetY')
  const dropOffsetX = event.layerX
  const dropOffsetY = event.layerY
  // Boundary of float window
  let left, right, top, bottom
  left = dropOffsetX - dragOffsetX + offsetTarget.left
  top = dropOffsetY - dragOffsetY + offsetTarget.top +
        (isDescendantOfContent ? dragBar.offsetHeight : 0)
  right = left + floatWindow.clientWidth
  bottom = top + floatWindow.clientHeight
  return {
    left: left,
    right: right,
    top: top,
    bottom: bottom
  }
}

const onDoubleClickDragBar = (event) => {
  let dragBar = document.querySelector('.drag-bar')
  let floatWindow = document.querySelector('.float-window')
  let fixWindow = document.querySelector('.fix-window')
  let floatWindowContent = floatWindow.children[1]
  let fixWindowContent = fixWindow.children[0]
  // Exchange css of fix window and float window
  if (fixWindowContent.getAttribute('id') === 'code-viewer-exec') {
    fixWindow.style.width = sizeFixWindowCode.width * ratioFloatWindowCode + 'px'
    fixWindow.style.height = 'auto'
    fixWindowContent.style.width = sizeFixWindowCode.width * ratioFloatWindowCode + 'px'
    fixWindowContent.style.height = 'auto'

    floatWindow.style.width = sizeFixWindowCode.width + 'px'
    floatWindow.style.height = sizeFixWindowCode.height + 'px'
    floatWindowContent.style.width = sizeFixWindowVideo.width + 'px'
    floatWindowContent.style.height = sizeFixWindowVideo.height + 'px'
    if (tabReplayLive.platform === 'Android') {
      floatWindowContent.style.position = 'absolute'
    }

    tabReplayLive.isFloat = true
  } else {
    fixWindow.style.width = sizeFixWindowVideo.width * ratioFloatWindowVideo + 'px'
    fixWindowContent.style.width = sizeFixWindowVideo.width * ratioFloatWindowVideo + 'px'
    if (tabReplayLive.platform === 'api') {
      fixWindow.style.height = 'auto'
      fixWindowContent.style.height = 'auto'
    } else {
      fixWindow.style.height = sizeFixWindowVideo.height * ratioFloatWindowVideo + dragBar.offsetHeight + 'px'
      fixWindowContent.style.height = sizeFixWindowVideo.height * ratioFloatWindowVideo + 'px'
      if (tabReplayLive.platform === 'Android') {
        fixWindowContent.style.position = 'static'
      }
    }

    floatWindow.style.width = sizeFixWindowCode.width + 'px'
    floatWindow.style.height = sizeFixWindowCode.height + 'px'
    floatWindowContent.style.width = sizeFixWindowCode.width + 'px'
    floatWindowContent.style.height = sizeFixWindowCode.height + 'px'

    tabReplayLive.isFloat = false
  }
  // Clone position of float window
  fixWindow.style.left = floatWindow.style.left
  fixWindow.style.top = floatWindow.style.top
  // Move drag bar from float window to fix window
  fixWindow.insertBefore(dragBar, fixWindowContent)
  // Toggle class
  floatWindow.classList.toggle('fix-window')
  floatWindow.classList.toggle('float-window')
  fixWindow.classList.toggle('fix-window')
  fixWindow.classList.toggle('float-window')
  // Make sure full screen button is at the bottom
  let viewBox = document.querySelector('.view-box')
  let fullScreenButton = document.querySelector('#btn-full-screen')
  if (fullScreenButton) viewBox.appendChild(fullScreenButton)
}

const onDragStartDragBar = (event) => {
  event.dataTransfer.setData('dragOffsetX', event.offsetX)
  event.dataTransfer.setData('dragOffsetY', event.offsetY)
  tabReplayLive.dropped = false
}

const onDragOverDocument = (event) => {
  event.preventDefault()
}

const onDropDocument = (event) => {
  event.preventDefault()
  let floatWindow = document.querySelector('.float-window')
  let fixWindow = document.querySelector('.fix-window')
  let floatWindowContent = floatWindow.children[1]
  let fixWindowContent = fixWindow.children[0]
  let isDescendantOfFloatWindow = utilElement.isDescendant(floatWindow, event.target)
  let isDescendantOfFixWindow = utilElement.isDescendant(fixWindow, event.target)
  if (isDescendantOfFloatWindow || isDescendantOfFixWindow) {
    // In the scope of fix window and float window
    let viewBox = document.querySelector('.view-box')
    // Offset between fix window and view box
    let offsetFixWindowContent = utilElement.offsetBetween(viewBox, fixWindow)
    // Set position of float window
    let floatWindowBoundary = positionAfterDrop(event, isDescendantOfFixWindow)
    floatWindow.style.left = floatWindowBoundary.left + 'px'
    floatWindow.style.top = floatWindowBoundary.top + 'px'
    // Out of boundary
    let fixWindowBoundary = {
      left: offsetFixWindowContent.left,
      right: offsetFixWindowContent.left + fixWindow.clientWidth,
      top: offsetFixWindowContent.top,
      bottom: offsetFixWindowContent.top + fixWindow.clientHeight
    }
    let gutter = 5
    let gutterBottom = 25
    if (floatWindowBoundary.right > fixWindowBoundary.right - gutter) {
      let leftRegulate = fixWindowBoundary.right - floatWindow.clientWidth - gutter
      floatWindow.style.left = leftRegulate < fixWindowBoundary.left + gutter
        ? fixWindowBoundary.left + gutter + 'px'
        : leftRegulate + 'px'
    }
    if (floatWindowBoundary.bottom > fixWindowBoundary.bottom - gutterBottom) {
      let topRegulate = fixWindowBoundary.bottom - floatWindow.clientHeight - gutterBottom
      floatWindow.style.top = topRegulate < fixWindowBoundary.top + gutter
        ? fixWindowBoundary.top + gutter + 'px'
        : topRegulate + 'px'
    }
    if (floatWindowBoundary.left < fixWindowBoundary.left + gutter) {
      floatWindow.style.left = fixWindowBoundary.left + gutter + 'px'
    }
    if (floatWindowBoundary.top < fixWindowBoundary.top + gutter) {
      floatWindow.style.top = fixWindowBoundary.top + gutter + 'px'
    }
  } else if (floatWindowContent.getAttribute('id') === 'code-viewer-exec') {
    // Out of scope of fix window and float window
    floatWindow.classList.remove('float-window')
    floatWindow.style.width = 'auto'
    floatWindow.style.height = 'auto'
    if (tabReplayLive.platform === 'Android') {
      fixWindowContent.style.position = 'static'
    }
    document.querySelector('#fix-code-viewer').appendChild(floatWindow)
    tabReplayLive.isFloat = false
    tabReplayLive.isSeparated = true
  }
  tabReplayLive.dropped = true
}

export default {
  addCodeViewerListeners: function (_this) {
    tabReplayLive = _this
    sizeFixWindowVideo = utilPlatform.getVideoSize(utilPlatform.platformToNodeType(tabReplayLive.platform))
    ratioFloatWindowVideo = tabReplayLive.platform === 'Android' ? 250 / 320 : 480 / 1024
    let checkDragBarExist = function () {
      let dragBar = document.querySelector('.drag-bar')
      if (dragBar) {
        dragBar.addEventListener('dblclick', onDoubleClickDragBar, false)
        dragBar.addEventListener('dragstart', onDragStartDragBar, false)
        clearInterval(intervalIdCheckDragBar)
      }
    }
    let intervalIdCheckDragBar = setInterval(checkDragBarExist, 100)
    let checkDragAreaExist = function () {
      let dragArea = document.querySelector('.drag-area')
      if (dragArea) {
        dragArea.addEventListener('drop', onDropDocument, false)
        dragArea.addEventListener('dragover', onDragOverDocument, true)
        clearInterval(intervalIdCheckDragArea)
      }
    }
    let intervalIdCheckDragArea = setInterval(checkDragAreaExist, 100)
  },
  backToFloat: function (tabReplayLive) {
    let fixWindow = document.querySelector('.fix-window')
    let fixWindowContent = fixWindow.children[0]
    if (tabReplayLive.platform === 'Android') {
      fixWindowContent.style.position = 'absolute'
    }
    let codeViewer = document.querySelector('#fix-code-viewer').children[0]
    codeViewer.classList.add('float-window')
    codeViewer.style.width = sizeFixWindowCode.width * ratioFloatWindowCode + 'px'
    codeViewer.style.height = 'auto'
    fixWindow.parentNode.appendChild(codeViewer)
    tabReplayLive.isFloat = true
    tabReplayLive.isSeparated = false
  }
}
