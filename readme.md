# Full Stack Notes Application using Node and Express

## Introduction:

Herewith my submission for Week-7's challenge: a full-stack 'Note-Taking' application, using Node and Express. The note-taking application allows the user to: create new notes, view existing notes, then edit or delete a Note.

---

## The Solution:

The solution comprises an Express server (backend), serving static frontend files and providing a RESTful API managing the Notes. The server serves static files from a directory named 'public', making the frontend (HTML, CSS and JS files), directly accessible to clients. The server provides a set of API endpoints for performing CRUD (Create, Read, Update, Delete) operations on Notes. The Notes being persisted in a data.json file on the server's file system.

API Endpoints:
- GET /data: Retrieves all stored notes.
- POST /data: Creates a new note. The post expects a title and text content in the request body. Each new note is automatically assigned a unique ID based on the current timestamp. If either the title or text is missing, post returns a 400 error.
- GET /data/:id: Fetche a single note based on its unique ID. If the note isn't found, it returns a 404 error.
- PUT /data/:id: Updates an existing note identified by its unique ID. This Put expects the title and updated text content in the request body. If the note isn't found or the updated field is missing, it returns appropriate error responses.
- DELETE /data/:id: Removes a note based on its unique ID. If the note isn't found, it returns a 404 error.  

The public\script.js file applies the frontend logic for the Notes application. It is responsible for all user interactions and communication with the backend API. It focuses on the CRUD operations on the data, accessed from the user's browser, via the API. The script.js file deals with: initial setuo and DOM loading/reference, API interaction for Note management functions, and User interaction (UI management).  

The solution source files have been judiciously commented, to provide in-line documentation. So, specific solution features and coding strategies will not be repeated here. However, some justification of my solution design strategy will be offered.  

---

## Design Strategy

An initial Proof of Concept (PoC) design was formulated based on a classroom example discussed earlier in week-7 (week-7\W7-S3-Express\9_ServeStatic\exercise), which covered the implementation of a static file and data server, in Express. The 9_ServeStatic\exercise dealt with data items rather than Notes. Some code structures and naming conventions were carried over into the Note-taking server and maintained, hence the inappropriate

9_ServeStatic\exercise required the import of UUIDv4, in order to generate the pseudo-random identifiers needed to uniquely identify and CRUD the data items. Originally, my Note-taking solution drew from this model, using UUIDv4 for Note Id generation. Foolishly, and unnecessarily, I displayed these long pseudo-random character sets in the Note-taking UI. This unhelpful visual feature drove me to find a more visually user-friendly means to generate and display the unique Id. Thus, I chose to amploy a time stamp (at point of note creation) to uniquely identify the note. Converting the time stamp (elapsed milliseconds since the Unix Epoch) to a user meaningful date/time was costly, in time and effort, and unnecessary. 

While the timestamp is likely to be adequate as a unique identifier, for low levels of access, should the application come under heavy usage, it is possible that creation collisions could occur. Thus, undermining the integrity of the identifier.

I believe that the project does fulfil the challenge requirements brief and serves a useful Note-taking app. However, during the evolution of this project, it appears that one poor designed decision followed another.

---

## Installation Strategy

The installation strategy for a Node.js server involves using npm (Node Package Manager), as bundled with Node.js. The goal is to set up the project with all its external dependencies (like Express) correctly installed and managed. First, we need to install Node, per the operating system in question. See the official Node.js website for details: https://nodejs.org/

Having successfully installed Node, we can go to the VSCode terminal to install project dependency files.

| Procedure                                                       | Bash Command          |
|:----------------------------------------------------------------|:----------------------|
| Verify Node installed and accessible from our project file.     |$: node -v             |
| Initialise npm (creating package.json file).                    |$: npm init            |
| Install Express (creating node_modules and package-lock.json).  |$: npm install express |
|                                                                 |                       |

- npm init: The purpose of npm init is to initialize a new Node.js project and create the foundational configuration file for it: package.json.

- npm install express: When we run npm install express in a directory that contains a package.json file, npm downloads express and its transitive dependencies. It places all the downloaded package files (for express and its transitive dependencies) in node_modules. This is where Node.js looks for modules when we use require('express') in our code. It also updates the package.json file, and gGenerates/updates the package-lock.json file.

- Now we are ready to develop the server project.

- Having completed the project, we can start the server by simply running: $: node server.js

---

## Deployment

### GitHub:

The source and depandency files have been pushed to my GitHub week7 repository for public access at https://github.com/paulmayer-fullstacker/Week7. Before pushing to gitHub, a .gitignore file was created to exclude (ignore) the node_modules dependency directory. The addition of this line in the .gitignore file (node_modules/) causes git to ignore a node_modules directory help within any subdirectory.  

### Render:

The project has also been deployed to the Render hosting site, for public access. The URL is https://week7-gauu.onrender.com/. It is recommended to use an incognito browser window to access the solution. The project has been hosted on a free tier of Render. So, after a few minutes of inactivity, the resources are shut down. Thus, on initial access, the service may take a few minutes to start

---

## To Conclude:

I hope that that this submission is adequate and appropriate, at this stage of the course.  

I believe that the project does fulfil the challenge requirements brief and serves a useful Note-taking app.

---

<br/>

<hr style="height: 5px; background-color: black; border: none;">