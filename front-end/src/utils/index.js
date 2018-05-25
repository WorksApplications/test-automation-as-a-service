export const cloneObj = (target, source) => {
  try {
    if (typeof target !== 'object') {
      throw Error('The target is not an object')
    }
    if (typeof source !== 'object') {
      throw Error('The source is not an object')
    }

    Object.keys(source).forEach(p => {
      if (source[p] === null) {
        target[p] = source[p]
      } else if (typeof source[p] === 'object') {
        if (Array.isArray(source[p])) {
          target[p] = cloneObj([], source[p])
        } else {
          target[p] = cloneObj({}, source[p])
        }
      } else {
        target[p] = source[p]
      }
    })
  } catch (e) {
    return false
  }

  return target
}

export const promiseThen = (thenDo, params = []) => (data) => {
  if (Array.isArray(params)) {
    thenDo.apply(this, params)
  } else {
    thenDo.call(this, params)
  }
  return data
}

export const cloneArrMonitored = (targetArr, fromArr = []) => {
  targetArr.splice(0)
  fromArr.forEach(ele => {
    targetArr.push(ele)
  })

  return targetArr
}

export default {
  cloneObj, cloneArrMonitored
}
