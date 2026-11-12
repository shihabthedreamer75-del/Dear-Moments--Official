
import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDoKf2d4Do0kqKdttDec_Yu5AW-xocjxqU",
    authDomain: "dear-moments-bf2a5.firebaseapp.com",
    projectId: "dear-moments-bf2a5",
    storageBucket: "dear-moments-bf2a5.firebasestorage.app",
    messagingSenderId: "699945956834",
    appId: "1:699945956834:web:2ade64329a09b17451f5bb",
    measurementId: "G-E2MR90WZPE"
};

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const authReady = new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe();
        resolve(user);
    });
});

export {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    onSnapshot
};
