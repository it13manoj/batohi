require('../config/firebaseAdmin')
const { getMessaging } = require('firebase-admin/messaging')

/**
 * Global helper to dispatch FCM push notifications.
 */
const sendPushNotification = async (token, { title, body, icon, data = {} }) => {
  return true
  if (!token) {
    console.warn('[FCM Helper] No target FCM token provided.')
    return { success: false, reason: 'No FCM token provided' }
  }

  // Fallback to default public icon if icon is missing or undefined
  const validIcon = (icon && typeof icon === 'string' && icon.trim() !== '') 
    ? icon 
    : '/notification.png'

  // Ensure all values inside data object are strings
  const sanitizedData = {}
  for (const key in data) {
    sanitizedData[key] = String(data[key])
  }

  const payload = {
    token: token,
    notification: {
      title,
      body
    },
    webpush: {
      notification: {
        title,
        body,
        icon: validIcon, // Always receives a valid string path
        requireInteraction: true
      }
    },
    data: sanitizedData
  }

  try {
    const response = await getMessaging().send(payload)
    console.log('[FCM Helper] Notification sent successfully:', response)
    return { success: true, messageId: response }
  } catch (error) {
    console.error('[FCM Helper] Error sending notification:', error)
    return { success: false, error: error.message }
  }
}

module.exports = sendPushNotification