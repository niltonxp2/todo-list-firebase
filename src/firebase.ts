// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC0nYmV_RNDaQPbgWgirbQO2QJmkQspT1Q',
  authDomain: 'todo-list-357c3.firebaseapp.com',
  databaseURL: 'https://todo-list-357c3-default-rtdb.firebaseio.com',
  projectId: 'todo-list-357c3',
  storageBucket: 'todo-list-357c3.appspot.com',
  messagingSenderId: '190453493135',
  appId: '1:190453493135:web:6c54cc1ad500b79864effa',
  measurementId: 'G-1FY5QKRFSW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// We can create a Login Screen so the user can input this information
signInWithEmailAndPassword(auth, 'nitinhosilva1996@gmail.com', 'Tatu9012')
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('user logged ->', user);
  })
  .catch((error) => {
    console.log('Error ->', error);
  });
