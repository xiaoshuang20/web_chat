class Message {
  success(message) {
    ElMessage({
      message,
      type: 'success',
      offset: 120,
      duration: 1500,
    })
  }
  warn(message) {
    ElMessage({
      message,
      type: 'warning',
      offset: 120,
      duration: 1500,
    })
  }
  error(message) {
    ElMessage({
      message,
      type: 'error',
      offset: 120,
      duration: 1500,
    })
  }
}

export const message = new Message()
