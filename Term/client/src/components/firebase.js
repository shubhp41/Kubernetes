// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIErwqqAaCXlQjeQqSuvfimDYO5ED4tig",
    authDomain: "fir-auth-yt-78d6d.firebaseapp.com",
    projectId: "fir-auth-yt-78d6d",
    storageBucket: "fir-auth-yt-78d6d.appspot.com",
    messagingSenderId: "668109464275",
    appId: "1:668109464275:web:4f4648eefb3d7797786a26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app



