import Prism from 'prismjs'

export default {
  highlightLine: (pre, lineNumber, background) => {
    var line = pre.querySelector('.line-highlight[data-line="' + lineNumber + '"]') || document.createElement('div')

    line.setAttribute('aria-hidden', 'true')
    line.setAttribute('data-line', lineNumber)
    line.className = 'line-highlight'

    var lineNode = Prism.plugins.lineNumbers.getLine(pre, lineNumber)
    if (lineNode) {
      line.style.top = lineNode.offsetTop + 'px'
    }
    line.style.height = lineNode.offsetHeight + 'px'
    line.style.background = background

    if (line.style.height !== '0px') {
      pre.querySelector('code').appendChild(line)
    }
  }
}
