import utilSelectCascade from '@/utils/selectCascade'
import utilPlatforms from '@/utils/platforms'

export const testcasesHeader = [{
  value: 'license',
  label: 'License',
  children: [{
    value: 'subsystem',
    label: 'Subsystem',
    children: [{
      value: 'module',
      label: 'Module',
      children: [{
        value: 'testcase',
        label: 'Testcase'
      }]
    }]
  }]
}]

export default {
  testcasesHeader,
  testcasesToCascade (node, withTestcase) {
    let cascade = []
    let count = 0
    for (let child in node) {
      if (child !== 'taas_metadata' && child !== 'testcases') {
        let nodeChild = {
          value: child,
          label: node[child].taas_metadata.name
        }
        let grandchildren = this.testcasesToCascade(node[child], withTestcase)
        if (grandchildren.items.length > 0) {
          nodeChild.children = grandchildren.items
          nodeChild.childrenCount = grandchildren.count
          count += grandchildren.count
        }
        cascade.push(nodeChild)
      } else if (child === 'testcases' && withTestcase) {
        node[child].forEach((testcase) => {
          cascade.push({
            value: testcase,
            label: testcase.name
          })
        })
        count += node[child].length
      }
    }
    return {
      items: cascade,
      count: count
    }
  },
  filterByType (testcases, type) {
    if (type === 'all') return
    testcases.slice().reverse().forEach((testcase, index, array) => {
      if (testcase.children) {
        this.filterByType(testcase.children, type)
        if (testcase.children.length === 0) {
          testcases.splice(array.length - 1 - index, 1)
        }
      } else if (testcase.value.type !== type) {
        testcases.splice(array.length - 1 - index, 1)
      }
    })
  },
  pathsToLocators (paths, platform, testcasesScope) {
    this.filterByType(
      testcasesScope,
      utilPlatforms.getType(platform)
    )
    let leaves = utilSelectCascade.arrayOfPathToLeaves(paths, testcasesScope)
    return leaves.map(testcase => testcase.value.locator)
  }
}
