function regSw() {
  const applicationServerPublicKey =
    'BMHNptnTN5tE7s6qv6rMjyGY-mI2e0lkv3DT2Vc' +
    'LqNsbPH5VH8ygM6lh35lhvwJh7XU2u5vLJDGQVGhUoRnenwk';

  let isSubscribed = false;
  let swRegistration = null;

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      })
      .then(function(subscription) {
        console.log('User is subscribed');
        isSubscribed = true;
      })
      .catch(function(err) {
        console.log('Failed to subscribe the user: ', err);
      });
  }

  function initializeUI() {
    if (!isSubscribed) {
      subscribeUser();
    }

    swRegistration.pushManager.getSubscription().then(function(subscription) {
      isSubscribed = !(subscription === null);

      if (isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
      }
    });
  }

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker
      .register('/sw.js')
      .then(function(swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initializeUI();
      })
      .catch(function(error) {
        console.error('Service Worker Error', error);
      });
  } else {
    console.warn('Push messaging is not supported');
  }
}

export default regSw;
