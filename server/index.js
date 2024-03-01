const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
// open cors to all
const cors = require("cors");
app.use(cors("*"));
// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const {
  addUser,
  getUser,
  getUserNotes,
  getNotes,
  getNote,
  addNote,
  deleteNote,
} = require("./database");
const jwt = require("jsonwebtoken");

const signToken = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).send("Token is required.");
  }
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.username = decoded.username;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid token.");
  }
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user_signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.status(400).send("Username and password are required.");
    return;
  }
  const user = await getUser(username);
  if (user) {
    res.status(400).send("Username already exists.");
    return;
  }
  addUser(username, password);
  res.status(200).send("User created successfully.");
});

app.post("/user_login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.status(400).send("Username and password are required.");
  }
  const user = await getUser(username);
  if (user !== password) {
    res.status(401).send("Invalid username or password.");
  }
  const token = signToken(username);
  res.status(200).send({
    token,
    username,
  });
});

app.get("/note/:id", verifyToken, async (req, res) => {
  const username = req.username;
  const noteId = req.params.id;
  const note = await getNote(noteId);
  if (!note) {
    res.status(404).send("Note not found.");
  }
  // if (note.owner !== username && username !== "admin") {
  //   res.status(401).send("Unauthorized.");
  // }
  res.status(200).send(note);
});

app.get("/my_notes", verifyToken, async (req, res) => {
  const username = req.username;
  const notes = await getUserNotes(username);
  res.status(200).send(notes);
});

app.post("/add_note", verifyToken, async (req, res) => {
  const username = req.username;
  const note = req.body.note;
  if (!note) {
    res.status(400).send("Note is required.");
  }
  const new_note = await addNote(note, username);
  res.status(200).send("Note added successfully.");
});

app.post("/delete_note", verifyToken, async (req, res) => {
  const username = req.username;
  const noteId = req.body.noteId;
  if (!noteId) {
    res.status(400).send("Note ID is required.");
  }
  await deleteNote(noteId, username);
  res.status(200).send("Note deleted successfully.");
});

app.get("/admin_notes", verifyToken, async (req, res) => {
  const username = req.username;
  if (username !== "admin") {
    res.status(401).send("Unauthorized.");
    return;
  }
  const notes = await getNotes();
  res.status(200).send(notes);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Notes app listening at http://localhost:${port}`);
});
