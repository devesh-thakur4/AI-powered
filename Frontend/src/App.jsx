import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import GenerateTask from "./components/GenerateTask";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks/getAll")
      .then(res => setTasks(res.data))
      .catch(err => console.log(err))
  }, []);

  const handleLogoClick = async () => {
    try {
      await axios.delete("http://localhost:5000/tasks/chat/clear/devesh123");
      window.location.reload(); // fresh start
    } catch (err) {
      console.error("Failed to clear chat", err);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <img
          src="https://i.pinimg.com/1200x/f7/e4/db/f7e4db74e1fbcde1cb97f132e937173d.jpg"
          alt=""
          className="app-logo"
          onClick={handleLogoClick}
        />
        <p>Manage your tasks with AI assistance</p>
      </header>

      {/* Main content */}
      <main className="app-main">
        <section className="app-card">
          <TaskForm setTasks={setTasks} />
        </section>

        <section className="app-card task-list-card">
          <TaskList tasks={tasks} setTasks={setTasks} />
        </section>

        <section className="app-card">
          <GenerateTask setTasks={setTasks} />
        </section>
      </main>
    </div>
  );
}

export default App;
