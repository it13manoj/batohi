// Src/config/firebaseAdmin.js
const { initializeApp, cert, getApps } = require('firebase-admin/app')
const serviceAccount = require('./serviceAccountKey.json')

// Prevent re-initialization if already initialized
let firebaseApp
if (getApps().length === 0) {
  firebaseApp = initializeApp({
    credential: cert(serviceAccount)
  })
} else {
  firebaseApp = getApps()[0]
}

module.exports = firebaseApp