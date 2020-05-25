self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    event.waitUntil(handlePushNotification());
  });

async function handlePushNotification() {
  const title = 'PWA Check - push';
  const options = {
    body: 'Push notification published by the service worker.',
  };

  await acknowledgePushNotification()
  return self.registration.showNotification(title, options)
}

async function acknowledgePushNotification() {
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  })
  
  if (clients && clients.length) {
    await clients.forEach(async client => {
      await client.postMessage({
        type: 'ACK_PUSH_NOTIFICATION',
      }); 
    });
  }
}