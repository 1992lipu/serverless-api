module.exports = function (statusCode, statusMessage) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: statusMessage
    })
  }
}