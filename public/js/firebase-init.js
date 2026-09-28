// Initializes the Firebase client app safely without requiring external connections
let auth = null;
if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey) {
  try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
  } catch (err) {
    console.warn('Firebase initialization skipped (offline mode):', err.message);
  }
}