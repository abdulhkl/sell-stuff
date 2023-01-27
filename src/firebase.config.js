// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDk4grKKxXDXBS96raz8ZahhdxEgDHFw5I",
    authDomain: "fire-base-app-2022.firebaseapp.com",
    projectId: "fire-base-app-2022",
    storageBucket: "fire-base-app-2022.appspot.com",
    messagingSenderId: "829345504479",
    appId: "1:829345504479:web:1f5b4334a5b65dcbe7dd6a"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()