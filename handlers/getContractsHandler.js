module.exports.getContracts = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Get Contracts Handler'
  //   })
  // };
  // callback(null, response);

  const Contract = require('../models/contracts.js')
  const setResponse = require('./setResponse.js')
  const connectToDatabase = require('./dbHandler')
  const reqbody = event.pathParameters

  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      // Get user email
      const filter = { email: reqbody.email, contractStatus: { "$ne": "Deleted" } }

      Contract.find(filter)
        .then(contracts => {
          if (!contracts || contracts.length === 0) {
            return callback(null, setResponse(404, 'No contracts found.  Please upload using New Document'))
          }
          return callback(null, setResponse(200, contracts))
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })
    }).catch(err => {
      return callback(null, setResponse(500, 'DB Connection error: ' + err.message))
    })
}
