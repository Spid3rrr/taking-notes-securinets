import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin_notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
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
      <h1 className="font-bold text-4xl p-6">Admin Notes</h1>
      <p className="p-6">
        These are all the notes in the system. Only the admin can see this page.
      </p>
      {notes.length == 0 && (
        <p className="text-4xl text-red-500">You are not the admin !</p>
      )}
      <ul>
        {notes.map((note, index) => (
          <li key={index}>
            <a href={"/note/" + note.id}>{note.note}</a>{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Admin;
