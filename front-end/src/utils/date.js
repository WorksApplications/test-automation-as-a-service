const shorten = (str) => str.substr(4, 25) + str.substr(34, 39)

export const toUTCString = (str) => (new Date(str)).toUTCString()

export const toLocaleDateString = (str) => (new Date(str)).toLocaleDateString()

export const toString = (str) => shorten((new Date(str)).toString())

export const getDateTimeFromObjectId = (objectId) => {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
}
