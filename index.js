

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const users = require('./users')
const logs = require('./logs')
const org = require('./org')
const messaging = require('./messaging')

exports.users = users.app
exports.logs = logs.post
exports.org = org.message   // for organizations. 
exports.messaging= messaging.message

