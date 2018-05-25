export const showMessage = (_this) => (message, type = 'success') => (data) => {
  _this.$message({
    message: message,
    type: type,
    showClose: true
  })

  return data
}
