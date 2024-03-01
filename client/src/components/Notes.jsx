import React, { useEffect, useState } from "react";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/my_notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setNotes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotes();
  }, []);
  return (
    <div>
      <h1 className="font-bold text-4xl p-6">My Notes</h1>
      <ul>
        {notes.map((note, index) => (
          <li key={index}><a href={"/note/"+note.id}>
            {note.note}
            </a> </li>
        ))}
      </ul>
    </div>
  );
};
export default Notes;
