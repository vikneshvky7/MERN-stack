import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { TaskForm } from "../components/TaskForm";
import { Task } from "../components/Task";
import { API_URL } from "../config/global";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/todo`);
      let data = response.data;

      // Make sure we ALWAYS store an array in state
      if (!Array.isArray(data)) {
        console.warn("Expected array from /todo, got:", data);
        data = [];
      }

      setTasks(data);
    } catch (error) {
      console.error("Error during fetchTasks:", error);
      // keep state in a safe state
      setTasks([]);
    }
  };

  const addTask = () => {
    fetchTasks();
  };

  const updateTask = async (id, taskTitle) => {
    try {
      const response = await axios.put(`${API_URL}/todo/${id}`, {
        title: taskTitle,
      });

      if (response.data) {
        // refresh list after update
        await fetchTasks();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error during updateTask:", error);
      alert("Something went wrong. Try again.");
      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/todo/${id}`);
      console.log(response);

      if (response.data) {
        // use functional update to avoid stale state
        setTasks((prev) => prev.filter((task) => task._id !== id));
      }
    } catch (error) {
      console.error("Error during deleteTask:", error);
      alert("Something went wrong. Try again.");
    }
  };

  // Guarantee we never call slice/reverse on a non-array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <h1>
          Todo&nbsp;<span>App</span>
        </h1>
        <TaskForm addTask={addTask} />
      </div>

      <div className="task-list">
        {safeTasks.length ? (
          safeTasks
            .slice() // copy
            .reverse() // latest on top
            .map((task) => (
              <Task
                key={task._id}
                task={task.title}
                updateTask={(taskTitle) => updateTask(task._id, taskTitle)}
                deleteTask={() => deleteTask(task._id)}
              />
            ))
        ) : (
          <p>All tasks are complete! Well done!</p>
        )}
      </div>
    </div>
  );
}
