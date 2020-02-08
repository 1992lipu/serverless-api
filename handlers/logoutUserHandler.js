module.exports.logoutUser = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Logout User Handler'
    })
  };
  callback(null, response);
}