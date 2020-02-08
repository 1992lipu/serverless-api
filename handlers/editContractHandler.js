module.exports.editContract = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Edit Contract Details Handler'
  //   })
  // };
  // callback(null, response);

  const Contract = require('../models/contracts.js')
  const UserActivity = require('../models/userActivities.js')
  const connectToDatabase = require('./dbHandler')
  const setResponse = require('./setResponse.js')
  const reqbody = JSON.parse(event.body)

  // Check that required fields are not missing
  if (!(reqbody.fileName) || !(reqbody.email)) {
    return callback(null, setResponse(404, 'Required fields are missing'))
  }

  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      // find and update contract
      const filter = { contractFileName: reqbody.fileName, email: reqbody.email }

      Contract.findOne(filter)
        .then(contract => {
          if (!contract) {
            return callback(null, setResponse(404, 'Could not find contract: ' + reqbody.fileName))
          }

          for (var tagItem in reqbody.fileTags) {
            contract.contractTags.addToSet(reqbody.fileTags[tagItem])
          }

          const update = { contractTitle: reqbody.fileTitle, contractDesc: reqbody.fileDesc, contractFolder: reqbody.fileFolder, contractTags: contract.contractTags }

          Contract.findOneAndUpdate(filter, update, {new: true})
            .then(contract => {
              // log user activity
              const newActivity = new UserActivity({
                email: reqbody.email,
                userActivity: {
                  activityType: 'Edit Contract',
                  activityDesc: 'You edited details for: ' + reqbody.fileName
                }
              })
              newActivity.save()
                .then(data => {
                  return callback(null, setResponse(201, 'Updated contract'))
                }).catch(err => {
                  return callback(null, setResponse(500, 'Connection error: ' + err.message))
                })
            }).catch(err => {
              return callback(null, setResponse(500, 'Connection error: ' + err.message))
            })
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })
    }).catch(err => {
      return callback(null, setResponse(500, 'DB Connection error: ' + err.message))
    })
}
