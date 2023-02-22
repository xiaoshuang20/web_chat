const time = new Date()
const week = [
  '星期天',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
]

export function getCurrentTime() {
  let year = time.getFullYear()
  let month =
    time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
  let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
  let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
  let minute =
    time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
  let seconds =
    time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
  let current =
    '' +
    year +
    '-' +
    month +
    '-' +
    date +
    ' ' +
    hour +
    ':' +
    minute +
    ':' +
    seconds
  return current
}

export function expressTime(date) {
  let currentTime = time.getTime()
  let lastTime = new Date(date).getTime()
  let gap = (currentTime - lastTime) / 1000 / 60 / 60
  if (gap < 24) {
    return date.slice(11, 16)
  } else if (gap < 48) {
    return '昨天'
  } else if (gap < 72) {
    return '前天'
  } else {
    return week[time.getDay()]
  }
}
