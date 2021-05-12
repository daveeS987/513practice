import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyBFzg5rp8Pv-AddGCIf7juuVnhLJRIRrWM',
  authDomain: 'instagram-clone-react-9f61f.firebaseapp.com',
  projectId: 'instagram-clone-react-9f61f',
  storageBucket: 'instagram-clone-react-9f61f.appspot.com',
  messagingSenderId: '619753213668',
  appId: '1:619753213668:web:109495047ec8d8786226f1',
  measurementId: 'G-0PNFPH7PG1',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
