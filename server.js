// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
// const { v4: uuidv4 } = require("uuid");   //Redundant removed, favouring Date.now() for the ID.

// Create instance of Express application
const app = express();

// Listening port
const PORT = 3001;

// Parse incoming JSON requests
app.use(express.json());

//Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define the directory path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];  // If no data at the FilePath, return empty array.
  }
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing notes data:", error);
    // Should the file be corrupt, return an empty array to prevent server crash.
    return [];
  }
};

// Function: write data to the JSON file.
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
};

// Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle GET request to retrieve all stored data
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Handle GET request to retrieve a single note by ID
app.get("/data/:id", (req, res) => {
  const noteId = req.params.id;
  const currentData = readData();
  const foundNote = currentData.find(note => note.id === noteId);

  if (foundNote) {
    res.json(foundNote);
  } else {
    res.status(404).json({ message: "Note not found." });
  }
})

// POST request to save a new note with a unique ID, title, and text
app.post("/data", (req, res) => {
  const { title, text } = req.body; // Extract title and text from the request body

  // Basic validation: ensure that both title and text are provided
  if (!title || !text) {
    return res.status(400).json({ message: "Note title and content must be provided." });
  }

  const newData = {
    // id: uuidv4(), // Generate a unique ID. // Use Date.now() for the ID rather than the uuidv4 code
    id: Date.now().toString(), // Use current timestamp as ID
    title: title,
    text: text,
  };

  const currentData = readData(); // Get existing notes
  currentData.push(newData); // Add the new note
  writeData(currentData); // Write back to the file

  res.status(201).json({ message: "Note saved successfully", data: newData }); // 201 Created status
});

// Handle PUT request to update an existing note by ID
app.put("/data/:id", (req, res) => {
  const noteId = req.params.id;
  const { title, text } = req.body;
  let currentData = readData();
  const noteIndex = currentData.findIndex(note => note.id === noteId);

  if (noteIndex !== -1) {
    // Basic validation for updated fields
    if (!title || !text) {
        return res.status(400).json({ message: "Updated note title and text are required." });
    }
    currentData[noteIndex] = {
      ...currentData[noteIndex], // Keep existing properties if any
      title: title,
      text: text,
    };
    writeData(currentData);
    res.json({ message: "Note updated successfully", data: currentData[noteIndex] });
  } else {
    res.status(404).json({ message: "Note not found." });
  }
});

// Handle DELETE request to delete a note by ID
app.delete("/data/:id", (req, res) => {
  const noteId = req.params.id;
  let currentData = readData();
  const initialLength = currentData.length;
  currentData = currentData.filter(note => note.id !== noteId);

  if (currentData.length < initialLength) {
    writeData(currentData);
    res.status(200).json({ message: "Note deleted successfully." }); // 200 OK for successful deletion
  } else {
    res.status(404).json({ message: "Note not found." });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});