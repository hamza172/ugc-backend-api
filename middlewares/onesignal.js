const axios = require('axios');

const sendPushNotification = async (message, userId) => {
  const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
  const ONESIGNAL_API_KEY = process.env.ONESIGNAL_SAFARI_WEB_ID;

  const notificationData = {
    app_id: ONESIGNAL_APP_ID,
    headings: { en: 'New Notification' },
    contents: { en: message },
    include_player_ids: [userId], // The player/user ID of the recipient(s)
    // You can include more advanced options here, like data payload, images, etc.
  };

  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      notificationData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    );
    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.response?.data || error.message);
  }
};
