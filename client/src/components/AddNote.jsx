import React, { useState } from "react";
import axios from "axios";

const AddNote = () => {
  const [note, setNote] = useState("");

  const handleAddNote = async () => {
    if (!note) return;
    try {
      // get token for localstorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/add_note`,
        {
          note: note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Note added successfully");
        // redirect to /
        window.location.href = "/";
      }
      setNote("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-center center justify-center">
      <input
        type="text"
        value={note}
        className="input input-bordered w-full max-w-xs text-black"
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="btn" type="button" onClick={handleAddNote}>
        Add Note
      </button>
    </div>
  );
};

export default AddNote;
