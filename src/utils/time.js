const time = new Date()

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
