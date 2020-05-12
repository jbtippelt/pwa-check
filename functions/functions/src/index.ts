import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

exports.sendTestNotification = functions.region('europe-west3').database.ref('/push-tokens/{fcmToken}')
    .onWrite(async (change, context) => {
        const fcmToken = context.params.fcmToken;
        const metadata = change.after.val()
        console.log(`Received new update. fcmToken=${fcmToken}, metadata=${metadata}`)

        const payload = {
            notification: {
              title: 'Test Push Notification',
              body: `This is a push notification from firebase.`
            }
          };

        if(!metadata.sent) {
            const messageSentResponse = await admin.messaging().sendToDevice(fcmToken, payload);
            console.log('Message Sent Response:', messageSentResponse)

            await admin.database().ref(`/push-tokens/${fcmToken}`).remove()
            console.log('Database reference removed.')
        }
        return true
});