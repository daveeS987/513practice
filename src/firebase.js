import firebase from 'firebase';

firebase.initializeApp({
  apiKey: 'AIzaSyCD7ld8m92E1LGBqBfylw2cvOQi4DES6o0',
  authDomain: 'instagram-clone-mern-f0ec5.firebaseapp.com',
  projectId: 'instagram-clone-mern-f0ec5',
  storageBucket: 'instagram-clone-mern-f0ec5.appspot.com',
  messagingSenderId: '91644023389',
  appId: '1:91644023389:web:8d07c38441b121105833b4',
  measurementId: 'G-3Z6EVW2ZW1',
});

const auth = firebase.auth();
const storage = firebase.storage();

export { auth, storage };
