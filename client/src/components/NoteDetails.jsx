import React, { useState, useEffect } from "react";
import axios from "axios";

const NoteDetails = () => {
  const [note, setNote] = useState({
    note: null,
  });
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const id = window.location.pathname.split("/")[2];
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/note/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        console.log(data);
        setNote(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNote();
  }, []);
  return (
    <div>
      {note.note && (
        <div>
          <h1 className="text-2xl">Note Number : {note.id}</h1>
          <h1 className="text-xl">By : {note.owner}</h1>
          <p>{note.note}</p>
        </div>
      )}
      {!note.note && (
        <div>
          <h1 className="text-2xl">Note Not Found</h1>
        </div>
      )}
    </div>
  );
};
export default NoteDetails;
