// connect to redis
const redis = require("redis");
const client = redis.createClient({
  url: 'redis://redis:6379'
});
client.connect();

client.on("connect", () => {
  console.log("Connected to Redis...");
});

client.on("error", (err) => {
  console.log("Error: " + err);
});

client.set("notes_counter", 1);
client.set(
  "note_0",
  "whoops, you are not mean to see this, this is private admin info !"
);
client.set("note_0_owner", "admin");

const getNotes = async () => {
  const result = [];
  const counter = await client.get("notes_counter");
  for (let i = 0; i < counter; i++) {
    const note = await client.get(`note_${i}`);
    if (note) {
      result.push({
        id: i,
        note,
        owner: await client.get(`note_${i}_owner`),
      });
    }
  }
  return result;
};

const getNote = async (note_id) => {
  const note = await client.get(`note_${note_id}`);
  const owner = await client.get(`note_${note_id}_owner`);
  return {
    id: note_id,
    note,
    owner,
  };
};

const addNote = async (note, owner) => {
  const counter = await client.get("notes_counter");
  await client.set("notes_counter", counter + 1);
  await client.set(`note_${counter}`, note);
  await client.set(`note_${counter}_owner`, owner);
};

const deleteNote = (note_id) => {
  client.del(`note_${note_id}`);
  client.del(`note_${note_id}_owner`);
};

const addUser = (username, password) => {
  client.set(username, password);
};

const getUser = (username) => {
  return client.get(username);
};

const getUserNotes = async (username) => {
  const result = [];
  const counter = await client.get("notes_counter");
  for (let i = 0; i < counter; i++) {
    const note = await client.get(`note_${i}`);
    const owner = await client.get(`note_${i}_owner`);
    if (owner === username && note) {
      result.push({
        id: i,
        note,
      });
    }
  }
  return result;
};

module.exports = {
  getNotes,
  addNote,
  getNote,
  deleteNote,
  addUser,
  getUser,
  getUserNotes,
};
