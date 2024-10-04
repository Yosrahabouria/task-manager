import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState(new Date()); // State to handle selected date

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check for due tasks every minute
    const interval = setInterval(checkForDueTasks, 60000);
    
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [tasks]);

  const checkForDueTasks = () => {
    const now = new Date();
    tasks.forEach(task => {
      if (task.date <= now) {
        showDesktopNotification("Task Reminder", `It's time for your task: "${task.text}"`);
      }
    });
  };

  const showDesktopNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const showToastNotification = (message, type = "info") => {
    toast(message, { type });
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task = { id: tasks.length + 1, text: newTask, date: taskDate };
      setTasks([...tasks, task]);
      setNewTask(""); // Clear input

      // Show desktop notification when a task is added
      showDesktopNotification("Task Added", "You added a new task!");
      showToastNotification("Task added successfully!", "success");
    } else {
      showToastNotification("Please enter a task!", "error");
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    showToastNotification("Task deleted!", "warning");
  };

  return (
    <div>
      <h1>Task Manager with Notifications and Calendar</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter new task"
      />

      {/* Date picker for selecting task date */}
      <DatePicker
        selected={taskDate}
        onChange={(date) => setTaskDate(date)} // Update state with selected date
        showTimeSelect
        dateFormat="Pp"
        placeholderText="Select date and time"
      />

      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.text} - {task.date.toLocaleString()} {/* Display task date */}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
