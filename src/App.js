import React, { useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css"; // Default Tabulator styles
import "react-tabulator/css/bootstrap/tabulator_bootstrap4.min.css"; // Tabulator Bootstrap styles
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "To Do" });
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
      const formattedData = response.data.slice(0, 20).map((task) => ({
        id: task.id,
        title: task.title,
        description: "Sample description",
        status: task.completed ? "Done" : "To Do",
      }));
      setTasks(formattedData);
    };
    fetchData();
  }, []);

  // Add a new task
  const addTask = () => {
    const newTaskData = { ...newTask, id: tasks.length + 1 };
    setTasks([...tasks, newTaskData]);
    setNewTask({ title: "", description: "", status: "To Do" });
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Filter tasks
  const filteredTasks = filterStatus
    ? tasks.filter((task) => task.status === filterStatus)
    : tasks;

  // Tabulator column configuration
  const columns = [
    { title: "ID", field: "id", width: 50 },
    { title: "Title", field: "title", editor: "input" },
    { title: "Description", field: "description", editor: "input" },
    {
      title: "Status",
      field: "status",
      editor: "select",
      editorParams: { values: ["To Do", "In Progress", "Done"] },
    },
    {
      title: "Actions",
      formatter: (cell) => {
        return `<button class='btn btn-danger btn-sm'>Delete</button>`;
      },
      cellClick: (e, cell) => {
        deleteTask(cell.getRow().getData().id);
      },
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Task List Manager</h1>

      {/* Add New Task Form */}
      <div className="mb-4">
        <h4>Add New Task</h4>
        <div className="form-group">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <select
            className="form-control mb-2"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button className="btn btn-primary" onClick={addTask}>
            Add Task
          </button>
        </div>
      </div>

      {/* Task Filter */}
      <div className="mb-4">
        <h4>Filter Tasks</h4>
        <select
          className="form-control"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Task Table */}
      <ReactTabulator
        data={filteredTasks}
        columns={columns}
        layout="fitData"
        options={{
          movableRows: true,
        }}
        className="mb-4"
      />
    </div>
  );
};

export default TaskManager;
