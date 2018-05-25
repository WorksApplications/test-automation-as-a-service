import _ from 'lodash'

const getChildren = (prefixPath, allItems) => {
  let parent = allItems
  for (let depth = 0; depth < prefixPath.length; depth++) {
    let child = parent.find(item => {
      return item.label === prefixPath[depth].label
    })
    parent = child.children
  }
  return parent
}

const getChildrenWithPrefix = (prefixPath, allItems) => {
  let childrenWithPrefix = []
  getChildren(prefixPath, allItems).forEach(child => {
    childrenWithPrefix.push(
      prefixPath.concat({
        label: child.label,
        value: child.value
      }))
  })
  return childrenWithPrefix
}

const withChildren = (itemPath, allItems) => {
  let newItemPath = _.cloneDeep(itemPath)
  newItemPath[newItemPath.length - 1].children = getChildren(itemPath, allItems)
  return newItemPath
}

const pushToObject = (path, objects) => {
  if (path.length === 0) return
  let root = path[0]
  let pushed = false
  // Check whether can add to exist object
  objects.forEach(object => {
    if (_.isEqual(object.value, root.value)) {
      pushToObject(path.slice(1), object.children)
      pushed = true
    }
  })
  if (pushed) return
  // Cannot, then new an object to push
  let objectToPush
  if (root.children) {
    // Leaf node
    objectToPush = root
    objects.push(objectToPush)
  } else {
    objectToPush = {
      label: root.label,
      value: root.value,
      children: []
    }
    objects.push(objectToPush)
    pushToObject(path.slice(1), objectToPush.children)
    if (objectToPush.children.length === 0) delete objectToPush.children
  }
}

const unfoldChildren = (children, leaves) => {
  children.forEach(child => {
    if (child.children) {
      unfoldChildren(child.children, leaves)
    } else {
      leaves.push(child)
    }
  })
}

export default {
  updateCheckChildren: function (allItems, checkedItems, itemPath, checked) {
    let newCheckedItems = _.cloneDeep(checkedItems)
    if (checked) {
      _.remove(newCheckedItems, item => {
        return _.isEqual(itemPath,
          item.slice(0, itemPath.length))
      })
      newCheckedItems.push(itemPath)
      for (let depth = itemPath.length - 1; depth > 0; depth--) {
        let prefixPath = itemPath.slice(0, depth)
        let isBrother = item => {
          return _.isEqual(item.slice(0, depth), prefixPath) &&
            prefixPath.length + 1 === item.length
        }
        let filtered = _.filter(newCheckedItems, isBrother)
        // Merge if all children are checked
        if (filtered.length === getChildrenWithPrefix(prefixPath, allItems).length) {
          _.remove(newCheckedItems, isBrother)
          newCheckedItems.push(prefixPath)
        } else {
          break
        }
      }
    } else {
      for (let depth = 1; depth <= itemPath.length; depth++) {
        let prefixPath = itemPath.slice(0, depth)
        let removed = _.remove(newCheckedItems, item => {
          return _.isEqual(item, prefixPath)
        })
        // Separate the parent if a child is unchecked
        if (depth < itemPath.length && removed[0]) {
          newCheckedItems = newCheckedItems.concat(getChildrenWithPrefix(prefixPath, allItems))
        }
      }
    }
    return _.cloneDeep(newCheckedItems)
  },
  arrayOfPathToObjects (arrayOfPath, allItems) {
    let objects = []
    arrayOfPath.forEach(path => {
      pushToObject(withChildren(path, allItems), objects)
    })
    return objects
  },
  arrayOfPathToLeaves (arrayOfPath, allItems) {
    let leaves = []
    arrayOfPath.forEach(path => {
      let children = getChildren(path, allItems)
      if (children) {
        unfoldChildren(children, leaves)
      } else {
        leaves.push(path[path.length - 1])
      }
    })
    return leaves
  }
}
