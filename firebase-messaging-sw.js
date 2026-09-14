importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyDv2kkZPznQon9G833Ola1mJ-If9W6-Er4",
  authDomain: "batohi-driver.firebaseapp.com",
  projectId: "batohi-driver",
  storageBucket: "batohi-driver.firebasestorage.app",
  messagingSenderId: "317124968447",
  appId: "1:317124968447:web:20d63dfe2e92c7a18bb1ca"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-128x128.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})