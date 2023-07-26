// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDVGCBzniosB6A5fUkV96B2iKSSi-eZnJ8",
    authDomain: "my-project-for-oauth2-3e8ab.firebaseapp.com",
    projectId: "my-project-for-oauth2-3e8ab",
    storageBucket: "my-project-for-oauth2-3e8ab.appspot.com",
    messagingSenderId: "920538009802",
    appId: "1:920538009802:web:5d94ecc06494720124a433",
    measurementId: "G-L29JR13JHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth();

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email')



export { auth, provider, signInWithPopup };