import React, { useEffect } from "react";
import axios from "axios";

function TaskList({ tasks, setTasks }) {
  // Load all real tasks when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks/getAll")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Failed to fetch tasks", err));
  }, [setTasks]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <div className="tasklist-container">
      {tasks.length === 0 && <p className="empty-msg">No tasks available</p>}
      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          <div className="task-content">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-desc">{task.description}</p>
          </div>
          <div className="task-menu">
            <span className="created-by">Created by: {task.createdBy}</span>
            {task.createdBy !== "AI" && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
