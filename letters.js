
/* ==========================================
   DEAR MOMENTS — FIRESTORE LETTERS SYSTEM
   ========================================== */

import {
    authReady,
    db,
    collection,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    onSnapshot
} from "./firebase.js";


document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // 1. SELECT HTML ELEMENTS
    // ==========================================

    const letterForm = document.getElementById("letterForm");
    const letterTitle = document.getElementById("letterTitle");
    const letterRecipient = document.getElementById("letterRecipient");
    const letterMessage = document.getElementById("letterMessage");

    const characterCount = document.getElementById("characterCount");
    const letterCount = document.getElementById("letterCount");
    const lettersContainer = document.getElementById("lettersContainer");

    const envelopeOverlay = document.getElementById("envelopeOverlay");
    const animatedEnvelope = document.getElementById("animatedEnvelope");

    const letterModal = document.getElementById("letterModal");
    const closeModal = document.getElementById("closeModal");

    const modalTitle = document.getElementById("modalTitle");
    const modalRecipient = document.getElementById("modalRecipient");
    const modalMessage = document.getElementById("modalMessage");
    const modalDate = document.getElementById("modalDate");


    // ==========================================
    // 2. CONFIGURATION
    // ==========================================

    const STORAGE_KEY = "dearMomentsLetters";

    const MIGRATION_KEY = "dearMomentsLettersMigrated";

    const ALLOWED_EMAILS = [
        "shihabreza0075@gmail.com",
        "sadiaafrinruponti4@gmail.com"
    ];

    let letters = [];
    let currentUser = null;


    // ==========================================
    // 3. LOCAL STORAGE BACKUP
    // ==========================================

    function getLocalLetters() {

        try {

            const savedData = localStorage.getItem(STORAGE_KEY);

            const parsedData = savedData
                ? JSON.parse(savedData)
                : [];

            return Array.isArray(parsedData)
                ? parsedData
                : [];

        } catch (error) {

            console.error("Could not load local letters:", error);

            return [];

        }

    }


    // ==========================================
    // 4. CHARACTER COUNTER
    // ==========================================

    function updateCharacterCount() {

        if (!letterMessage || !characterCount) return;

        characterCount.textContent = letterMessage.value.length;

    }

    if (letterMessage) {

        letterMessage.addEventListener(
            "input",
            updateCharacterCount
        );

        updateCharacterCount();

    }


    // ==========================================
    // 5. ENVELOPE ANIMATION
    // ==========================================

    function playEnvelopeAnimation() {

        if (!envelopeOverlay) return;

        envelopeOverlay.classList.add("active");

        if (animatedEnvelope) {

            animatedEnvelope.classList.remove("animate");

            void animatedEnvelope.offsetWidth;

            animatedEnvelope.classList.add("animate");

        }

        setTimeout(() => {

            envelopeOverlay.classList.remove("active");

            if (animatedEnvelope) {
                animatedEnvelope.classList.remove("animate");
            }

        }, 1800);

    }


    // ==========================================
    // 6. FORMAT DATE
    // ==========================================

    function formatDate(dateString) {

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    }


    // ==========================================
    // 7. RENDER SAVED LETTERS
    // ==========================================

    function renderLetters() {

        if (!lettersContainer) return;

        if (letterCount) {

            letterCount.textContent =
                `${letters.length} ${letters.length === 1 ? "Letter" : "Letters"}`;

        }

        lettersContainer.innerHTML = "";

        if (letters.length === 0) {

            const emptyState = document.createElement("div");

            emptyState.className = "empty-state";

            const icon = document.createElement("div");

            icon.className = "empty-state-icon";

            const iconElement = document.createElement("i");

            iconElement.className = "fa-regular fa-envelope";

            icon.appendChild(iconElement);

            const heading = document.createElement("h3");

            heading.textContent = "No letters yet";

            const paragraph = document.createElement("p");

            paragraph.textContent =
                "Your saved letters will appear here. Start writing your first letter.";

            emptyState.append(icon, heading, paragraph);

            lettersContainer.appendChild(emptyState);

            return;

        }


        letters.forEach((letter) => {

            const card = document.createElement("article");

            card.className = "letter-card saved-letter-card";

            const content = document.createElement("div");

            content.className = "letter-card-content";

            const title = document.createElement("h3");

            title.textContent = letter.title || "Untitled Letter";

            const recipient = document.createElement("p");

            recipient.className = "letter-card-recipient";

            recipient.textContent = letter.recipient
                ? `To: ${letter.recipient}`
                : "A personal letter";

            const preview = document.createElement("p");

            preview.className = "letter-preview";

            const message = letter.message || "";

            preview.textContent =
                message.length > 110
                    ? message.substring(0, 110) + "..."
                    : message;

            const date = document.createElement("span");

            date.className = "letter-card-date";

            date.textContent = formatDate(letter.date);

            const actions = document.createElement("div");

            actions.className = "letter-card-actions";


            // Read Button

            const viewButton = document.createElement("button");

            viewButton.type = "button";

            viewButton.className = "view-letter-btn";

            viewButton.innerHTML =
                '<i class="fa-regular fa-eye"></i> Read Letter';

            viewButton.addEventListener("click", () => {

                openLetter(letter.id);

            });


            // Delete Button

            const deleteButton = document.createElement("button");

            deleteButton.type = "button";

            deleteButton.className = "delete-letter-btn";

            deleteButton.innerHTML =
                '<i class="fa-regular fa-trash-can"></i> Delete';

            deleteButton.addEventListener("click", () => {

                deleteLetter(letter.id);

            });


            actions.append(viewButton, deleteButton);

            content.append(
                title,
                recipient,
                preview,
                date,
                actions
            );

            card.appendChild(content);

            lettersContainer.appendChild(card);

        });

    }


    // ==========================================
    // 8. OPEN LETTER
    // ==========================================

    function openLetter(id) {

        const letter = letters.find(item => item.id === id);

        if (!letter || !letterModal) return;

        if (modalTitle) {
            modalTitle.textContent = letter.title || "";
        }

        if (modalRecipient) {

            modalRecipient.textContent = letter.recipient
                ? `To: ${letter.recipient}`
                : "";

        }

        if (modalMessage) {
            modalMessage.textContent = letter.message || "";
        }

        if (modalDate) {
            modalDate.textContent = formatDate(letter.date);
        }

        letterModal.classList.add("active");

        document.body.classList.add("modal-open");

    }


    // ==========================================
    // 9. CLOSE LETTER MODAL
    // ==========================================

    function hideModal() {

        if (!letterModal) return;

        letterModal.classList.remove("active");

        document.body.classList.remove("modal-open");

    }

    if (closeModal) {

        closeModal.addEventListener("click", hideModal);

    }

    if (letterModal) {

        letterModal.addEventListener("click", (event) => {

            if (event.target === letterModal) {
                hideModal();
            }

        });

    }

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            hideModal();
        }

    });


    // ==========================================
    // 10. IMPORT OLD LOCAL LETTERS
    // ==========================================

    async function migrateOldLetters() {

        if (localStorage.getItem(MIGRATION_KEY) === "true") {

            console.log("Letters migration already completed.");

            return;

        }

        const oldLetters = getLocalLetters();

        try {

            for (const letter of oldLetters) {

                if (!letter.id) continue;

                const letterRef = doc(
                    db,
                    "letters",
                    String(letter.id)
                );

                const existingLetter = await getDoc(letterRef);

                // Never overwrite an existing Firestore letter.

                if (!existingLetter.exists()) {

                    await setDoc(letterRef, {

                        id: String(letter.id),

                        title: letter.title || "Untitled Letter",

                        recipient: letter.recipient || "",

                        message: letter.message || "",

                        date: letter.date || new Date().toISOString()

                    });

                }

            }

            // Mark migration complete only after successful import.

            localStorage.setItem(MIGRATION_KEY, "true");

            console.log("Old letters imported successfully.");

        } catch (error) {

            console.error("Letters migration failed:", error);

            throw error;

        }

    }


    // ==========================================
    // 11. SAVE NEW LETTER TO FIRESTORE
    // ==========================================

    if (letterForm) {

        letterForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const title = letterTitle.value.trim();

            const recipient = letterRecipient.value.trim();

            const message = letterMessage.value.trim();

            if (!title || !message) {

                alert("Please enter a letter title and message.");

                return;

            }

            if (!currentUser) {

                alert("Please sign in before saving a letter.");

                return;

            }

            const newLetter = {

                id: Date.now().toString(),

                title: title,

                recipient: recipient,

                message: message,

                date: new Date().toISOString()

            };

            const saveButton = letterForm.querySelector(
                'button[type="submit"]'
            );

            try {

                if (saveButton) {
                    saveButton.disabled = true;
                }

                await setDoc(
                    doc(db, "letters", newLetter.id),
                    newLetter
                );

                letterForm.reset();

                updateCharacterCount();

                playEnvelopeAnimation();

                alert("Your letter has been saved successfully!");

            } catch (error) {

                console.error("Could not save letter:", error);

                alert(
                    "Your letter could not be saved. Please check your internet connection and email verification."
                );

            } finally {

                if (saveButton) {
                    saveButton.disabled = false;
                }

            }

        });

    }


    // ==========================================
    // 12. DELETE LETTER FROM FIRESTORE
    // ==========================================

    async function deleteLetter(id) {

        const confirmed = confirm(
            "Are you sure you want to delete this letter?"
        );

        if (!confirmed) return;

        try {

            await deleteDoc(
                doc(db, "letters", String(id))
            );

            console.log("Letter deleted:", id);

            // Firestore listener automatically updates the page.

        } catch (error) {

            console.error("Could not delete letter:", error);

            alert(
                "Could not delete this letter. Please try again."
            );

        }

    }


    // ==========================================
    // 13. FIRESTORE INITIALIZATION
    // ==========================================

    try {

        // Wait until Firebase authentication is ready.

        currentUser = await authReady;

        if (!currentUser) {

            console.warn("No authenticated user found.");

            return;

        }

        const userEmail = currentUser.email
            ? currentUser.email.toLowerCase()
            : "";

        if (
            !currentUser.emailVerified ||
            !ALLOWED_EMAILS.includes(userEmail)
        ) {

            console.warn("User is not authorized to access letters.");

            return;

        }


        // Import old letters before starting the listener.

        await migrateOldLetters();


        // ==========================================
        // 14. REAL-TIME FIRESTORE LISTENER
        // ==========================================

        const lettersCollection = collection(db, "letters");

        onSnapshot(
            lettersCollection,

            (snapshot) => {

                letters = snapshot.docs.map((document) => {

                    return {

                        ...document.data(),

                        id: document.id

                    };

                });

                // Newest letters appear first.

                letters.sort((a, b) => {

                    return new Date(b.date).getTime() -
                        new Date(a.date).getTime();

                });

                renderLetters();

                console.log(
                    "Shared letters synchronized:",
                    letters.length
                );

            },

            (error) => {

                console.error("Firestore listener error:", error);

                alert(
                    "Could not load shared letters. Please check your email verification and Firestore permissions."
                );

            }

        );

    } catch (error) {

        console.error("Firebase Letters initialization failed:", error);

        alert(
            "Letters could not connect to Firebase. Please check your connection and try again."
        );

    }


    console.log("Dear Moments Letters initialized.");

});
