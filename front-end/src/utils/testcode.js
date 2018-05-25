const extractCodeFragment = (code, startLine, endLine) => {
  const lines = code.split('\n')
  let res = ''
  for (let i = startLine - 1; i < endLine; i++) {
    res += lines[i] + '\n'
  }
  return res
}

const findTestCaseByLocator = (locator, curNode) => {
  let testcase
  if (curNode.locator === locator) {
    return curNode
  }
  for (let node in curNode) {
    if (curNode[node] !== null && typeof (curNode[node]) === 'object') {
      testcase = findTestCaseByLocator(locator, curNode[node])
      if (testcase !== undefined) {
        return testcase
      }
    }
  }
  return testcase
}

const getCodeWithRealStartEndLine = code => {
  let regexMethodDeclare = new RegExp(/^\s*((public|protected|private) +)?(static +)?[\w<>[\]]+\s+(\w+) *\([^)]*\) *(throws\s+\w+(,\s*\w+)*)? *(\{?)\s*$/g)
  let lines = code.code.split('\n')
  // Look for start of method
  let indexStartLine = code.startLine + 1
  while (indexStartLine > 0) {
    if (lines[indexStartLine]
      .match(regexMethodDeclare) !== null) {
      code.startLine = indexStartLine
      break
    } else {
      indexStartLine--
    }
  }
  // Look for start of next method
  let indexEndLine = code.endLine
  let lastMethod = true
  while (indexEndLine < lines.length) {
    if (lines[indexEndLine - 1]
      .match(regexMethodDeclare) !== null) {
      lastMethod = false
      break
    } else {
      indexEndLine++
    }
  }
  let bracketEnd = 0
  if (lastMethod) {
    bracketEnd = 2
  } else {
    bracketEnd = 1
    indexEndLine--
  }
  // Go back to look for end of method ('}')
  while (indexEndLine > 0 && bracketEnd > 0) {
    if (lines[indexEndLine - 1].trim() === '}') {
      bracketEnd--
      if (bracketEnd === 0) {
        code.endLine = indexEndLine
        break
      }
      indexEndLine--
    } else {
      indexEndLine--
    }
  }
  return code
}

export default {
  extractCodeFragment,
  findTestCaseByLocator,
  getCodeWithRealStartEndLine
}
