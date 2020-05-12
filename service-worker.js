self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const title = 'PWA Check';
    const options = {
      body: 'Push notification published by the service worker.',
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });