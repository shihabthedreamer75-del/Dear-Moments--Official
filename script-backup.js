
/* ==========================================
   DEAR MOMENTS — COMPLETE JAVASCRIPT
   Enhanced Memory System
   ========================================== */


/* ==========================================
   1. TWINKLING BACKGROUND STARS
   ========================================== */

const starsContainer = document.getElementById("stars");

if (starsContainer) {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement("span");

        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 5 + "s";
        star.style.animationDuration = (2 + Math.random() * 4) + "s";
        star.style.opacity = Math.random();

        starsContainer.appendChild(star);
    }
}


/* ==========================================
   2. SCROLL TO MEMORIES
   ========================================== */

function scrollToMemories() {
    const memories = document.getElementById("memories");

    if (memories) {
        memories.scrollIntoView({ behavior: "smooth" });
    }
}


/* ==========================================
   3. SCROLL REVEAL ANIMATION
   ========================================== */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("active");
    });
}


/* ==========================================
   4. MOON MOUSE MOVEMENT
   ========================================== */

const moonScene = document.querySelector(".moon-scene");

if (moonScene) {
    moonScene.addEventListener("mousemove", event => {
        const rect = moonScene.getBoundingClientRect();

        const x = (event.clientX - rect.left - rect.width / 2) / 30;
        const y = (event.clientY - rect.top - rect.height / 2) / 30;

        moonScene.style.transform = `translate(${x}px, ${y}px)`;
    });

    moonScene.addEventListener("mouseleave", () => {
        moonScene.style.transform = "translate(0, 0)";
    });
}


/* ==========================================
   5. MEMORY TIMELINE
   SEARCH • FILTER • EDIT • DELETE
   ========================================== */

const memoryForm = document.getElementById("memoryForm");
const timelineList = document.getElementById("timelineList");

const MEMORY_STORAGE_KEY = "dearMomentsMemories";

let editingMemoryId = null;


/* GET MEMORIES */

function getMemories() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(MEMORY_STORAGE_KEY)
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}


/* SAVE MEMORIES */

function saveMemories(memories) {
    localStorage.setItem(
        MEMORY_STORAGE_KEY,
        JSON.stringify(memories)
    );
}


/* CREATE SEARCH AND FILTER AREA */

if (
    timelineList &&
    !document.getElementById("memoryTools")
) {
    const memoryTools = document.createElement("div");

    memoryTools.id = "memoryTools";
    memoryTools.className = "memory-tools";

    memoryTools.innerHTML = `
        <input
            type="search"
            id="memorySearch"
            placeholder="Search your memories..."
            aria-label="Search memories"
        >

        <div class="memory-date-filters">

            <div>
                <label for="memoryDateFrom">From Date</label>
                <input type="date" id="memoryDateFrom">
            </div>

            <div>
                <label for="memoryDateTo">To Date</label>
                <input type="date" id="memoryDateTo">
            </div>

        </div>

        <button type="button" id="clearMemoryFilters">
            Clear Filters
        </button>

        <p id="memoryResultsCount"></p>
    `;

    timelineList.parentNode.insertBefore(
        memoryTools,
        timelineList
    );


    /* MEMORY TOOLS DESIGN */

    const memoryStyle = document.createElement("style");

    memoryStyle.textContent = `
        .memory-tools {
            width: 100%;
            margin: 25px 0;
            padding: 22px;
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 18px;
            background: rgba(255,255,255,0.035);
            box-sizing: border-box;
        }

        .memory-tools input {
            width: 100%;
            box-sizing: border-box;
            padding: 13px 15px;
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 10px;
            background: rgba(255,255,255,0.06);
            color: #f8f9ff;
            font-family: inherit;
            outline: none;
            margin-bottom: 14px;
        }

        .memory-tools input:focus {
            border-color: #a5b4fc;
        }

        .memory-tools input::placeholder {
            color: #a0a9c0;
        }

        .memory-date-filters {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .memory-date-filters label {
            display: block;
            color: #c4b5fd;
            font-size: 13px;
            margin-bottom: 7px;
        }

        .memory-tools input[type="date"] {
            color-scheme: dark;
        }

        #clearMemoryFilters {
            padding: 10px 17px;
            border: 1px solid rgba(196,181,253,0.35);
            border-radius: 9px;
            background: transparent;
            color: #c4b5fd;
            cursor: pointer;
            font-family: inherit;
            margin-top: 5px;
        }

        #clearMemoryFilters:hover {
            background: rgba(196,181,253,0.12);
        }

        #memoryResultsCount {
            color: #a0a9c0;
            font-size: 13px;
            margin: 12px 0 0;
        }

        .memory-card-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .memory-card-actions button {
            padding: 8px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-family: inherit;
        }

        .edit-memory {
            background: rgba(165,180,252,0.12);
            border: 1px solid #a5b4fc;
            color: #c4b5fd;
        }

        .delete-memory {
            background: rgba(255,100,120,0.08);
            border: 1px solid rgba(255,100,120,0.4);
            color: #ff9aaa;
        }

        .memory-card-actions button:hover {
            opacity: 0.8;
        }

        .memory-empty-filter {
            text-align: center;
            color: #a0a9c0;
            padding: 30px 15px;
        }

        .cancel-memory-edit {
            display: none;
            width: 100%;
            margin-top: 10px;
            padding: 12px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 10px;
            background: transparent;
            color: #f8f9ff;
            cursor: pointer;
        }

        @media (max-width: 600px) {
            .memory-date-filters {
                grid-template-columns: 1fr;
                gap: 0;
            }
        }
    `;

    document.head.appendChild(memoryStyle);
}


/* CANCEL EDIT BUTTON */

let cancelMemoryEditButton = null;

if (memoryForm) {
    cancelMemoryEditButton =
        document.getElementById("cancelMemoryEdit");

    if (!cancelMemoryEditButton) {
        cancelMemoryEditButton = document.createElement("button");

        cancelMemoryEditButton.type = "button";
        cancelMemoryEditButton.id = "cancelMemoryEdit";
        cancelMemoryEditButton.className = "cancel-memory-edit";
        cancelMemoryEditButton.textContent = "Cancel Editing";

        memoryForm.appendChild(cancelMemoryEditButton);
    }
}


/* DISPLAY MEMORIES */

function displayMemories() {
    if (!timelineList) return;

    const memories = getMemories();

    const searchValue =
        document.getElementById("memorySearch")?.value
            .trim()
            .toLowerCase() || "";

    const dateFrom =
        document.getElementById("memoryDateFrom")?.value || "";

    const dateTo =
        document.getElementById("memoryDateTo")?.value || "";

    const filteredMemories = memories
        .filter(memory => {
            const matchesSearch =
                (memory.title || "").toLowerCase().includes(searchValue) ||
                (memory.description || "").toLowerCase().includes(searchValue);

            const matchesFrom =
                !dateFrom || memory.date >= dateFrom;

            const matchesTo =
                !dateTo || memory.date <= dateTo;

            return matchesSearch && matchesFrom && matchesTo;
        })
        .sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

    timelineList.innerHTML = "";

    const resultsCount =
        document.getElementById("memoryResultsCount");

    if (resultsCount) {
        resultsCount.textContent =
            `Showing ${filteredMemories.length} of ${memories.length} memories`;
    }

    if (memories.length === 0) {
        timelineList.innerHTML = `
            <div class="empty-message">
                <span>✧</span>
                <p>No memories added yet.</p>
                <small>Your beautiful journey starts here.</small>
            </div>
        `;
        return;
    }

    if (filteredMemories.length === 0) {
        timelineList.innerHTML = `
            <div class="memory-empty-filter">
                <span>✧</span>
                <p>No matching memories found.</p>
                <small>Try another search or clear your filters.</small>
            </div>
        `;
        return;
    }

    filteredMemories.forEach(memory => {
        const card = document.createElement("div");

        card.className = "timeline-card";

        const title = document.createElement("h3");
        title.textContent = memory.title;

        const date = document.createElement("span");
        date.className = "timeline-date";
        date.textContent = memory.date;

        const description = document.createElement("p");
        description.textContent = memory.description;

        const actions = document.createElement("div");
        actions.className = "memory-card-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-memory";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editMemory(memory.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-memory";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteMemory(memory.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(description);
        card.appendChild(actions);

        timelineList.appendChild(card);
    });
}


/* EDIT MEMORY */

function editMemory(id) {
    const memory = getMemories().find(item => {
        return String(item.id) === String(id);
    });

    if (!memory || !memoryForm) return;

    editingMemoryId = memory.id;

    document.getElementById("memoryTitle").value =
        memory.title;

    document.getElementById("memoryDate").value =
        memory.date;

    document.getElementById("memoryDescription").value =
        memory.description;

    const submitButton =
        memoryForm.querySelector('[type="submit"]');

    if (submitButton) {
        submitButton.innerHTML =
            `Update Memory <span>♡</span>`;
    }

    if (cancelMemoryEditButton) {
        cancelMemoryEditButton.style.display = "block";
    }

    memoryForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    document.getElementById("memoryTitle").focus();
}


/* CANCEL EDITING */

function cancelMemoryEditing() {
    editingMemoryId = null;

    if (memoryForm) {
        memoryForm.reset();

        const submitButton =
            memoryForm.querySelector('[type="submit"]');

        if (submitButton) {
            submitButton.innerHTML =
                `Save This Memory <span>♡</span>`;
        }
    }

    if (cancelMemoryEditButton) {
        cancelMemoryEditButton.style.display = "none";
    }
}

if (cancelMemoryEditButton) {
    cancelMemoryEditButton.addEventListener(
        "click",
        cancelMemoryEditing
    );
}


/* DELETE MEMORY */

function deleteMemory(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this memory?"
    );

    if (!confirmed) return;

    const updatedMemories = getMemories().filter(memory => {
        return String(memory.id) !== String(id);
    });

    saveMemories(updatedMemories);

    if (String(editingMemoryId) === String(id)) {
        cancelMemoryEditing();
    }

    displayMemories();
}


/* SAVE AND UPDATE MEMORY */

if (memoryForm) {
    memoryForm.addEventListener("submit", event => {
        event.preventDefault();

        const title =
            document.getElementById("memoryTitle")?.value.trim();

        const date =
            document.getElementById("memoryDate")?.value;

        const description =
            document.getElementById("memoryDescription")?.value.trim();

        if (!title || !date || !description) {
            alert("Please complete all fields.");
            return;
        }

        const memories = getMemories();

        if (editingMemoryId !== null) {
            const index = memories.findIndex(memory => {
                return String(memory.id) === String(editingMemoryId);
            });

            if (index !== -1) {
                memories[index] = {
                    ...memories[index],
                    title,
                    date,
                    description
                };
            }

            saveMemories(memories);
            cancelMemoryEditing();

            alert("Your memory has been updated. ♡");

        } else {
            memories.push({
                id: Date.now().toString(),
                title,
                date,
                description
            });

            saveMemories(memories);
            memoryForm.reset();

            alert("Your memory has been saved. ♡");
        }

        displayMemories();
    });
}


/* SEARCH */

const memorySearch =
    document.getElementById("memorySearch");

if (memorySearch) {
    memorySearch.addEventListener("input", displayMemories);
}


/* DATE FILTER */

const memoryDateFrom =
    document.getElementById("memoryDateFrom");

const memoryDateTo =
    document.getElementById("memoryDateTo");

if (memoryDateFrom) {
    memoryDateFrom.addEventListener("change", displayMemories);
}

if (memoryDateTo) {
    memoryDateTo.addEventListener("change", displayMemories);
}


/* CLEAR FILTERS */

const clearMemoryFilters =
    document.getElementById("clearMemoryFilters");

if (clearMemoryFilters) {
    clearMemoryFilters.addEventListener("click", () => {
        if (memorySearch) memorySearch.value = "";
        if (memoryDateFrom) memoryDateFrom.value = "";
        if (memoryDateTo) memoryDateTo.value = "";

        displayMemories();
    });
}


/* INITIALIZE TIMELINE */

displayMemories();


/* ==========================================
   6. MEMORY GALLERY
   ========================================== */

const photoInput = document.getElementById("photoInput");
const galleryGrid = document.getElementById("galleryGrid");

const GALLERY_STORAGE_KEY = "dearMomentsGallery";

let galleryFiles = [];


/* GET GALLERY PHOTOS */

function getGalleryPhotos() {
    try {
        const photos = JSON.parse(
            localStorage.getItem(GALLERY_STORAGE_KEY)
        );

        return Array.isArray(photos) ? photos : [];
    } catch (error) {
        return [];
    }
}


/* SAVE GALLERY PHOTOS */

function saveGalleryPhotos(photos) {
    try {
        localStorage.setItem(
            GALLERY_STORAGE_KEY,
            JSON.stringify(photos)
        );

        return true;

    } catch (error) {
        alert(
            "Your browser storage is full. Try removing some photos."
        );

        return false;
    }
}


/* GALLERY UPLOAD DETAILS FORM */

const galleryUpload = document.querySelector(".gallery-upload");

if (
    galleryUpload &&
    !document.getElementById("galleryDetailsForm")
) {
    const detailsForm = document.createElement("form");

    detailsForm.id = "galleryDetailsForm";
    detailsForm.className = "gallery-details-form";

    detailsForm.innerHTML = `
        <input
            type="text"
            id="photoCaption"
            placeholder="Write a caption for your photo..."
        >

        <input
            type="date"
            id="photoDate"
        >

        <div class="gallery-form-buttons">

            <button type="submit" id="savePhotoButton">
                Save Photo
            </button>

            <button type="button" id="cancelPhotoButton">
                Cancel
            </button>

        </div>
    `;

    galleryUpload.appendChild(detailsForm);
}


/* IMAGE COMPRESSION */

function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
            const image = new Image();

            image.onload = () => {
                const canvas = document.createElement("canvas");

                const maxWidth = 1000;
                const maxHeight = 1000;

                let width = image.width;
                let height = image.height;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(
                        maxWidth / width,
                        maxHeight / height
                    );

                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext("2d");

                context.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );

                resolve(
                    canvas.toDataURL("image/jpeg", 0.75)
                );
            };

            image.onerror = reject;
            image.src = event.target.result;
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}


/* DISPLAY GALLERY */

function displayGallery() {
    if (!galleryGrid) return;

    const photos = getGalleryPhotos();

    galleryGrid.innerHTML = "";

    if (photos.length === 0) {
        galleryGrid.innerHTML = `
            <p class="empty-message">
                Your gallery is waiting for beautiful moments. ♡
            </p>
        `;
        return;
    }

    photos.sort((a, b) => {
        return new Date(b.date || 0) - new Date(a.date || 0);
    });

    photos.forEach(photo => {
        const card = document.createElement("div");

        card.className = "gallery-card";

        const image = document.createElement("img");

        image.src = photo.image;
        image.alt = photo.caption || "Memory photo";

        image.addEventListener("click", () => {
            openLightbox(photo.image);
        });

        const caption = document.createElement("p");
        caption.className = "gallery-caption";
        caption.textContent = photo.caption || "A beautiful moment";

        const date = document.createElement("span");
        date.className = "gallery-date";
        date.textContent = photo.date || "";

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-photo";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deletePhoto(photo.id);
        });

        card.appendChild(image);
        card.appendChild(caption);
        card.appendChild(date);
        card.appendChild(deleteButton);

        galleryGrid.appendChild(card);
    });
}


/* DELETE PHOTO */

function deletePhoto(id) {
    const updatedPhotos = getGalleryPhotos().filter(photo => {
        return photo.id !== id;
    });

    if (saveGalleryPhotos(updatedPhotos)) {
        displayGallery();
    }
}


/* PHOTO SELECTION */

if (photoInput) {
    photoInput.addEventListener("change", event => {
        const files = Array.from(event.target.files);

        galleryFiles = files.filter(file => {
            return file.type.startsWith("image/");
        });

        const detailsForm =
            document.getElementById("galleryDetailsForm");

        if (detailsForm && galleryFiles.length > 0) {
            detailsForm.style.display = "block";
        }

        if (galleryFiles.length === 0 && files.length > 0) {
            alert("Please select valid image files.");
        }
    });
}


/* SAVE SELECTED PHOTOS */

const galleryDetailsForm =
    document.getElementById("galleryDetailsForm");

if (galleryDetailsForm) {
    galleryDetailsForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (galleryFiles.length === 0) {
            alert("Please select a photo first.");
            return;
        }

        const caption =
            document.getElementById("photoCaption")?.value.trim();

        const date =
            document.getElementById("photoDate")?.value ||
            new Date().toISOString().split("T")[0];

        const saveButton =
            document.getElementById("savePhotoButton");

        if (saveButton) {
            saveButton.disabled = true;
            saveButton.textContent = "Saving...";
        }

        try {
            const photos = getGalleryPhotos();

            for (const file of galleryFiles) {
                const compressedImage = await compressImage(file);

                photos.push({
                    id: Date.now().toString() +
                        Math.random().toString(36).slice(2),

                    image: compressedImage,
                    caption: caption || file.name,
                    date
                });
            }

            if (saveGalleryPhotos(photos)) {
                galleryFiles = [];

                galleryDetailsForm.reset();
                galleryDetailsForm.style.display = "none";

                if (photoInput) {
                    photoInput.value = "";
                }

                displayGallery();
            }

        } catch (error) {
            console.error("Gallery error:", error);
            alert("Could not save the selected photo.");

        } finally {
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.textContent = "Save Photo";
            }
        }
    });
}


/* CANCEL PHOTO SELECTION */

const cancelPhotoButton =
    document.getElementById("cancelPhotoButton");

if (cancelPhotoButton) {
    cancelPhotoButton.addEventListener("click", () => {
        galleryFiles = [];

        if (photoInput) {
            photoInput.value = "";
        }

        if (galleryDetailsForm) {
            galleryDetailsForm.reset();
            galleryDetailsForm.style.display = "none";
        }
    });
}


/* ==========================================
   7. GALLERY LIGHTBOX
   ========================================== */

function openLightbox(imageSource) {
    let lightbox = document.getElementById("memoryLightbox");

    if (!lightbox) {
        lightbox = document.createElement("div");

        lightbox.id = "memoryLightbox";
        lightbox.className = "memory-lightbox";

        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close">
                &times;
            </button>

            <img src="" alt="Full size memory">
        `;

        document.body.appendChild(lightbox);

        lightbox.addEventListener("click", event => {
            if (
                event.target === lightbox ||
                event.target.classList.contains("lightbox-close")
            ) {
                closeLightbox();
            }
        });
    }

    const lightboxImage = lightbox.querySelector("img");

    lightboxImage.src = imageSource;

    lightbox.classList.add("active");
}


function closeLightbox() {
    const lightbox =
        document.getElementById("memoryLightbox");

    if (lightbox) {
        lightbox.classList.remove("active");
    }
}


document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeLightbox();
    }
});


displayGallery();


/* ==========================================
   8. LITTLE THINGS JAR
   ========================================== */

const jarForm = document.getElementById("jarForm");
const jarInput = document.getElementById("jarInput");

const jarMessage = document.getElementById("jarMessage");
const jarCounter = document.getElementById("jarCounter");

const drawMessageButton =
    document.getElementById("drawMessageButton");

const JAR_STORAGE_KEY = "dearMomentsLittleJar";


/* GET SAVED NOTES */

function getJarNotes() {
    try {
        const notes = JSON.parse(
            localStorage.getItem(JAR_STORAGE_KEY)
        );

        return Array.isArray(notes) ? notes : [];
    } catch (error) {
        return [];
    }
}


/* SAVE NOTES */

function saveJarNotes(notes) {
    try {
        localStorage.setItem(
            JAR_STORAGE_KEY,
            JSON.stringify(notes)
        );

        return true;

    } catch (error) {
        alert("Unable to save your note in browser storage.");
        return false;
    }
}


/* UPDATE NOTE COUNTER */

function updateJarCounter() {
    if (!jarCounter) return;

    const notes = getJarNotes();

    jarCounter.textContent =
        `${notes.length} little ${notes.length === 1 ? "memory" : "memories"} saved`;
}


/* ADD A NEW NOTE */

if (jarForm) {
    jarForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!jarInput) return;

        const message = jarInput.value.trim();

        if (!message) {
            if (jarMessage) {
                jarMessage.textContent =
                    "Write a little something first. ♡";
            }

            return;
        }

        const notes = getJarNotes();

        const newNote = {
            id: Date.now().toString(),
            message: message,
            date: new Date().toISOString()
        };

        notes.push(newNote);

        if (saveJarNotes(notes)) {
            jarInput.value = "";

            if (jarMessage) {
                jarMessage.textContent =
                    "Your little note has found a home. ♡";
            }

            updateJarCounter();
        }
    });
}


/* PICK A RANDOM NOTE */

if (drawMessageButton) {
    drawMessageButton.addEventListener("click", () => {
        const notes = getJarNotes();

        if (notes.length === 0) {
            if (jarMessage) {
                jarMessage.textContent =
                    "Your jar is empty. Add your first little memory! ♡";
            }

            return;
        }

        const randomIndex =
            Math.floor(Math.random() * notes.length);

        const selectedNote = notes[randomIndex];

        if (jarMessage) {
            jarMessage.textContent = selectedNote.message;
        }
    });
}


/* INITIALIZE JAR */

updateJarCounter();


/* ==========================================
   9. INITIALIZATION
   ========================================== */

console.log(
    "%c Dear Moments ",
    "background: #a5b4fc; color: #080d1c; padding: 8px; border-radius: 8px; font-weight: bold;"
);

console.log(
    "Some moments deserve to live forever. ♡"
);
