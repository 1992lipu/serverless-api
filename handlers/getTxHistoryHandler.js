module.exports.getTxHistory = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Transaction History Handler'
  //   })
  // };
  // callback(null, response);

  const Transactions = require('../models/transactions')
  const setResponse = require('./setResponse.js')
  const connectToDatabase = require('./dbHandler')
  const reqbody = event.pathParameters

  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      // Get user activity data where activity type equals Token Usage
      const filter = { email: reqbody.email }
      Transactions.find(filter)
        .then(userTxs => {
          if ((!userTxs) || (userTxs.length === 0)) {
            return callback(null, setResponse(404, 'No transaction history found for this user'))
          }
          return callback(null, setResponse(200, userTxs))
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })
    }).catch(err => {
      return callback(null, setResponse(500, 'DB Connection error: ' + err.message))
    })
}
