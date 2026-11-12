
/* ==========================================
   DEAR MOMENTS — LETTERS JAVASCRIPT
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

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
    // 2. STORAGE
    // ==========================================

    const STORAGE_KEY = "dearMomentsLetters";

    let letters = [];

    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        letters = savedData ? JSON.parse(savedData) : [];

        if (!Array.isArray(letters)) {
            letters = [];
        }
    } catch (error) {
        console.error("Could not load letters:", error);
        letters = [];
    }


    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
        } catch (error) {
            alert("Your letter could not be saved. Browser storage may be full.");
            console.error(error);
        }
    }


    // ==========================================
    // 3. CHARACTER COUNTER
    // ==========================================

    function updateCharacterCount() {

        if (!letterMessage || !characterCount) return;

        characterCount.textContent = letterMessage.value.length;

    }

    if (letterMessage) {
        letterMessage.addEventListener("input", updateCharacterCount);
        updateCharacterCount();
    }


    // ==========================================
    // 4. ENVELOPE ANIMATION
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
    // 5. SAVE LETTER
    // ==========================================

    if (letterForm) {

        letterForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const title = letterTitle.value.trim();
            const recipient = letterRecipient.value.trim();
            const message = letterMessage.value.trim();

            if (!title || !message) {
                alert("Please enter a letter title and message.");
                return;
            }

            const newLetter = {
                id: Date.now().toString(),
                title: title,
                recipient: recipient,
                message: message,
                date: new Date().toISOString()
            };

            letters.unshift(newLetter);

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
            } catch (error) {
                letters.shift();
                alert("Could not save your letter. Please check browser storage.");
                console.error(error);
                return;
            }

            letterForm.reset();
            updateCharacterCount();

            renderLetters();
            playEnvelopeAnimation();

            alert("Your letter has been saved successfully!");

        });

    }


    // ==========================================
    // 6. RENDER SAVED LETTERS
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
            title.textContent = letter.title;

            const recipient = document.createElement("p");
            recipient.className = "letter-card-recipient";
            recipient.textContent = letter.recipient
                ? `To: ${letter.recipient}`
                : "A personal letter";

            const preview = document.createElement("p");
            preview.className = "letter-preview";
            preview.textContent =
                letter.message.length > 110
                    ? letter.message.substring(0, 110) + "..."
                    : letter.message;

            const date = document.createElement("span");
            date.className = "letter-card-date";
            date.textContent = formatDate(letter.date);

            const actions = document.createElement("div");
            actions.className = "letter-card-actions";

            const viewButton = document.createElement("button");
            viewButton.type = "button";
            viewButton.className = "view-letter-btn";
            viewButton.innerHTML = '<i class="fa-regular fa-eye"></i> Read Letter';

            viewButton.addEventListener("click", () => {
                openLetter(letter.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-letter-btn";
            deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i> Delete';

            deleteButton.addEventListener("click", () => {
                deleteLetter(letter.id);
            });

            actions.append(viewButton, deleteButton);
            content.append(title, recipient, preview, date, actions);
            card.appendChild(content);

            lettersContainer.appendChild(card);

        });

    }


    // ==========================================
    // 7. FORMAT DATE
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
    // 8. OPEN LETTER
    // ==========================================

    function openLetter(id) {

        const letter = letters.find(item => item.id === id);

        if (!letter || !letterModal) return;

        if (modalTitle) {
            modalTitle.textContent = letter.title;
        }

        if (modalRecipient) {
            modalRecipient.textContent = letter.recipient
                ? `To: ${letter.recipient}`
                : "";
        }

        if (modalMessage) {
            modalMessage.textContent = letter.message;
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
    // 10. DELETE LETTER
    // ==========================================

    function deleteLetter(id) {

        const confirmed = confirm(
            "Are you sure you want to delete this letter?"
        );

        if (!confirmed) return;

        const previousLetters = [...letters];

        letters = letters.filter(letter => letter.id !== id);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
        } catch (error) {
            letters = previousLetters;
            alert("Could not delete the letter. Please try again.");
            console.error(error);
            return;
        }

        renderLetters();

    }


    // ==========================================
    // 11. INITIAL LOAD
    // ==========================================

    renderLetters();

});

