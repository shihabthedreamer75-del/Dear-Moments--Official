
import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDoKf2d4Do0kqKdttDec_Yu5AW-xocjxqU",
    authDomain: "dear-moments-bf2a5.firebaseapp.com",
    projectId: "dear-moments-bf2a5",
    storageBucket: "dear-moments-bf2a5.firebasestorage.app",
    messagingSenderId: "699945956834",
    appId: "1:699945956834:web:2ade64329a09b17451f5bb",
    measurementId: "G-E2MR90WZPE"
};


const ALLOWED_EMAILS = [
    "shihabreza0075@gmail.com",
    "sadiaafrinruponti4@gmail.com"
];


const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);


document.body.style.visibility = "hidden";


onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    const email = (user.email || "").toLowerCase().trim();

    const isAllowed = ALLOWED_EMAILS.includes(email);

    if (isAllowed) {

        document.body.style.visibility = "visible";

    } else {

        await signOut(auth);
        window.location.replace("login.html");

    }

});
