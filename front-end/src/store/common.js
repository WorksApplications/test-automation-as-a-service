import { cloneObj } from '@/utils'

export const compareBy = (property) => (ele1, ele2) => ele1[property] === ele2[property]

export const findBy = (compareFn = compareBy('name')) => entity => ele => compareFn(ele, entity)

export const updateOne = (Constructor, equal = compareBy('name')) => (entities, entity) => {
  const exist = entities.some(ele => {
    if (equal(ele, entity)) {
      // update
      cloneObj(ele, entity)
    }
    return equal(ele, entity)
  })

  if (!exist) {
    // create
    entities.push(new Constructor(entity))
  }
  return entities
}

export const deleteOne = (byEntity = findBy('name')) => (entities, entity) => {
  const pos = entities.findIndex(byEntity(entity))
  entities.splice(pos, 1)

  return entities
}
