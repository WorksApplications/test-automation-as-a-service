const secondToArray = seconds => {
  const eleDays = Math.floor(seconds / 86400)
  const eleHours = Math.floor(seconds % 86400 / 3600)
  const eleMinutes = Math.floor(seconds % 3600 / 60)
  const eleSeconds = Math.floor(seconds % 60)
  return [eleDays, eleHours, eleMinutes, eleSeconds]
}

const dateDuration = (dateCurrent, dateStart, dateEnd) => {
  const timestampStart = new Date(dateStart).getTime()
  const timestampEnd = dateEnd ? new Date(dateEnd).getTime() : new Date(dateCurrent).getTime()
  const durationInSecond = Math.max(Math.round((timestampEnd - timestampStart) / 1000), 0)
  const durationArray = secondToArray(durationInSecond)
  let resultArray = []
  if (durationArray[0] > 0) {
    resultArray.push(`${durationArray[0]}d`)
  }
  if (durationArray[1] > 0) {
    resultArray.push(`${durationArray[1]}h`)
  }
  if (durationArray[2] > 0) {
    resultArray.push(`${durationArray[2]}m`)
  }
  if (durationArray[3] > 0 || durationInSecond === 0) {
    resultArray.push(`${durationArray[3]}s`)
  }
  return resultArray.join(' ')
}

const dateDisplay = (dateCurrent, date) => {
  const timestampStart = new Date(date).getTime()
  const timestampEnd = new Date(dateCurrent).getTime()
  const differenceInSecond = Math.round((timestampEnd - timestampStart) / 1000)
  const differenceArray = secondToArray(differenceInSecond)
  if (differenceArray[0] > 0) {
    return `${differenceArray[0]}d ago`
  } else if (differenceArray[1] > 0) {
    return `${differenceArray[1]}h ago`
  } else if (differenceArray[2] > 0) {
    return `${differenceArray[2]}m ago`
  } else {
    return `${differenceArray[3]}s ago`
  }
}

const dateString = date => date.substring(0, 10)

const datetimeString = date => `${date.substring(0, 10)} ${date.substring(11, 19)}`

export default {
  dateDuration,
  dateDisplay,
  dateString,
  datetimeString
}
