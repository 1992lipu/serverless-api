module.exports.uploadContract = (event, context, callback) => {
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Upload Contract Handler'
  //   })
  // };
  // callback(null, response);

  const Contract = require('../models/contracts.js')
  const UserActivity = require('../models/userActivities.js')
  const connectToDatabase = require('./dbHandler')
  const setResponse = require('./setResponse.js')
  const reqbody = JSON.parse(event.body)

  // Check that required fields are not missing
  if (!(reqbody.fileName) || !(reqbody.fileTitle) || !(reqbody.email)) {
    return callback(null, setResponse(404, 'Required fields are missing'))
  }

  console.log(typeof reqbody.fileTags)

  context.callbackWaitsForEmptyEventLoop = false

  connectToDatabase()
    .then(() => {
      // Check if a contract with the same name exists
      const filter = { email: reqbody.email, contractFileName: reqbody.fileName }
      Contract.findOne(filter)
        .then(contract => {
          if (contract) {
            return callback(null, setResponse(404, 'A contract with the same file name already exists.  Please choose another file to upload'))
          }
        }).catch(err => {
          return callback(null, setResponse(500, 'Connection error: ' + err.message))
        })

      // Create a new contract
      const newContract = new Contract({
        email: reqbody.email,
        contractFileName: reqbody.fileName,
        contractTitle: reqbody.fileTitle,
        contractDesc: reqbody.fileDesc,
        contractFolder: reqbody.fileFolder
      })

      for (var tagItem in reqbody.fileTags) {
        newContract.contractTags.addToSet(reqbody.fileTags[tagItem])
      }
      
      // add code to upload file and create hash of file contents and block chain code

      // Save contract in the database
      newContract.save()
        .then(contract => {
          // add tags to user profile
          // log user activity
          const newActivity = new UserActivity({
            email: reqbody.email,
            userActivity: {
              activityType: 'Upload Contract',
              activityDesc: 'You uploaded the document: ' + reqbody.fileTitle
            }
          })
          newActivity.save()
            .then(data => {
              return callback(null, setResponse(201, 'Uploaded contract'))
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
