
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase.js";

// Hide page until authentication is checked
document.documentElement.style.visibility = "hidden";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("login.html");
        return;
    }

    await user.reload();

    if (!user.emailVerified) {

        await signOut(auth);

        alert("Please verify your email before accessing Dear Moments.");

        window.location.replace("login.html");
        return;
    }

    // Verified users can access the website.
    // Firestore Rules will control their private data access.
    document.documentElement.style.visibility = "visible";

});
