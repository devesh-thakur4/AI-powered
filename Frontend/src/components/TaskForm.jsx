import React, { useState } from "react";
import axios from "axios";

function TaskForm({ setTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const handleAdd = async () => {
    if (!title.trim() || !description.trim() || !createdBy.trim()) {
      return alert("Please fill all fields");
    }

    try {
      const res = await axios.post("http://localhost:5000/tasks/create", {
        title,
        description,
        createdBy,
      });
      setTasks(prev => [...prev, res.data]);
      setTitle("");
      setDescription("");
      setCreatedBy("");
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  return (
    <div>
      <div className="sidebar-title">Add Task</div>

      <input
        className="input"
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="input"
        placeholder="Description"
        rows="3"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <input
        className="input"
        type="text"
        placeholder="Created By"
        value={createdBy}
        onChange={e => setCreatedBy(e.target.value)}
      />

      <button className="btn" onClick={handleAdd}>
        ➕ Add Task
      </button>
    </div>
  );
}

export default TaskForm;
