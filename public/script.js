document.addEventListener("DOMContentLoaded", () => {
    // Ensure that the entire HTML document is loaded and parsed before the script starts executing.

    // DOM Element References for Note List/Create form
    const notesList = document.getElementById("notes-list");
    const noteForm = document.getElementById("note-form");
    const noteTitleInput = document.getElementById("note-title-input");
    const noteTextInput = document.getElementById("note-text-input");
    // DOM Element References for Note view/edit modal window)
    const noteDetailModal = document.getElementById("note-detail-modal");
    const closeButton = noteDetailModal.querySelector(".close-button");
    const detailNoteId = document.getElementById("detail-note-id");
    const detailNoteTitle = document.getElementById("detail-note-title");
    const detailNoteText = document.getElementById("detail-note-text");
    const editButton = document.getElementById("edit-button");
    const deleteButton = document.getElementById("delete-button");
    const saveEditButton = document.getElementById("save-edit-button");
    const cancelEditButton = document.getElementById("cancel-edit-button");

    let currentNoteId = null; // Reference to the note currently being viewed/edited

    // Function to fetch all notes from the backend API and display them
    const fetchNotes = async () => {
        try {   // Try to handle potential errors during the API call.
            const response = await fetch("/data");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const notes = await response.json();
            // Parse successful response body as JSON

            notesList.innerHTML = ""; // Clear current list

            if (notes.length === 0) {
                notesList.innerHTML = "<li>No notes yet. Add one above!</li>";
                return;
            }

            notes.forEach((note) => {  // Rendering Note summaries in a list
                const li = document.createElement("li");

                // Timestamp formatting for Note list item
                const createdDate = new Date(parseInt(note.id));
                const formattedDate = createdDate.toLocaleString('en-GB', {
                    // Convert note.id (timestamp) to human readable date/time for display
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',   // No seconds in the list for brevity
                    hour12: false        // 24Hr format
                });
                // Timestamp
                // Reference Note by note.id (timestamp). Display Note as li item. Display timestanp as formatted date/time string.
                li.innerHTML = `
                    <div class="note-info" data-id="${note.id}">
                        <span class="note-title">${note.title}</span><br>
                        <span class="note-id">Created: ${formattedDate}</span>
                    </div>
                `;
                notesList.appendChild(li);  // Add list item to list.
            });
        } catch (error) {
            console.error("Error fetching notes:", error);
            notesList.innerHTML = "<li>Error loading notes. Please try again.</li>";
        }
    };

    // Function to fetch a single note by ID and display it in the modal window.
    const viewNote = async (id) => {
        try {   // Using timestamp as note.id to fetch Note for view/edit.
            const response = await fetch(`/data/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const note = await response.json();

            currentNoteId = note.id; // Store the ID of the note being viewed
            detailNoteTitle.textContent = note.title;

            //
            const date = new Date(parseInt(note.id)); // Convert timestamp string to number, then to Date object
            detailNoteId.textContent = `Created: ${date.toLocaleString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',  // Seconds used to improve uniqueness
                hour12: false // Use 24-hour format
            })}`;
            //
            detailNoteText.value = note.text;
            detailNoteText.readOnly = true; // Make text area read-only initially

            // Show view/edit/delete buttons, hide save/cancel
            editButton.style.display = 'inline-block';
            deleteButton.style.display = 'inline-block';
            saveEditButton.style.display = 'none';
            cancelEditButton.style.display = 'none';

            noteDetailModal.style.display = "flex"; // Show the modal
        } catch (error) {
            console.error("Error viewing note:", error);
            alert("Could not load note details.");
        }
    };

    // Function to enable editing mode for the note
    const enableEditMode = () => {
        detailNoteText.readOnly = false;
        detailNoteText.focus(); // Focus on the textarea for immediate editing

        // Toggle button visibility
        editButton.style.display = 'none';
        deleteButton.style.display = 'none';
        saveEditButton.style.display = 'inline-block';
        cancelEditButton.style.display = 'inline-block';
    };

    // Function to save edited note
    const saveEditedNote = async () => {
        const updatedTitle = detailNoteTitle.textContent; // Title is displayed as text, not input
        const updatedText = detailNoteText.value.trim();

        if (!updatedTitle || !updatedText) {
            alert("Note title and content cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`/data/${currentNoteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: updatedTitle, text: updatedText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            alert("Note updated successfully!");
            noteDetailModal.style.display = "none"; // Close modal
            fetchNotes(); // Refresh list
        } catch (error) {
            console.error("Error updating note:", error);
            alert("Failed to update note: " + error.message);
        }
    };

    // Function to delete a note
    const deleteNote = async () => {
        if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
            return; // User cancelled
        }

        try {
            const response = await fetch(`/data/${currentNoteId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            alert("Note deleted successfully!");
            noteDetailModal.style.display = "none"; // Close modal
            fetchNotes(); // Refresh list
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("Failed to delete note: " + error.message);
        }
    };

    // Handle form submission to add a new note
    noteForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newNote = {
            title: noteTitleInput.value.trim(),
            text: noteTextInput.value.trim(),
        };

        if (!newNote.title || !newNote.text) {
            alert("Please enter both a title and some content for your note.");
            return;
        }

        try {
            const response = await fetch("/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newNote),
            });

            if (response.ok) {
                noteTitleInput.value = "";
                noteTextInput.value = "";
                fetchNotes(); // Refresh the list
            } else {
                const errorData = await response.json();
                console.error("Error adding note:", errorData.message || "Unknown error");
                alert("Failed to save note: " + (errorData.message || "Server error."));
            }
        } catch (error) {
            console.error("Error adding note:", error);
            alert("Network error. Could not connect to the server.");
        }
    });

    // Handle clicks on the note-info div within the notes list
    notesList.addEventListener("click", (event) => {
        // Find the closest ancestor with the class 'note-info'
        const noteInfoDiv = event.target.closest(".note-info");
        if (noteInfoDiv) {
            const noteId = noteInfoDiv.dataset.id; // Get the ID from the data-id attribute
            viewNote(noteId);
        }
    });

    // Close the modal when the 'x' is clicked
    closeButton.addEventListener("click", () => {
        noteDetailModal.style.display = "none";
        // Reset read-only status when closing
        detailNoteText.readOnly = true;
    });

    // Close the modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target === noteDetailModal) {
            noteDetailModal.style.display = "none";
            // Reset read-only status when closing
            detailNoteText.readOnly = true;
        }
    });

    // Edit button click handler
    editButton.addEventListener("click", enableEditMode);

    // Save Changes button click handler
    saveEditButton.addEventListener("click", saveEditedNote);

    // Cancel Edit button click handler
    cancelEditButton.addEventListener("click", () => {
        detailNoteText.readOnly = true; // Revert to read-only
        // Show edit/delete buttons, hide save/cancel
        editButton.style.display = 'inline-block';
        deleteButton.style.display = 'inline-block';
        saveEditButton.style.display = 'none';
        cancelEditButton.style.display = 'none';
        viewNote(currentNoteId); // Re-fetch to revert changes
    });

    // Delete button click handler
    deleteButton.addEventListener("click", deleteNote);

    // Load the Note Pad
    fetchNotes();
});
// Can't believe that this file has become so big. 
// I've made this unnecessarily complex because of viewing the note.id as a Date/Time.
