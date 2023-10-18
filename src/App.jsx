import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/todo");
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({
      ...newTodo,
      [name]: value,
    });
  };

  const handleAddTodo = async () => {
    try {
      const response = await fetch("http://localhost:3000/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos([...todos, data]);
        setNewTodo({ title: "", description: "" });
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/todo/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted todo from the state
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-4 rounded shadow-md">
        <div className="mb-4">
          <input
            type="text"
            name="title"
            value={newTodo.title}
            onChange={handleInputChange}
            placeholder="Add todo title..."
            className="w-full p-2 rounded border shadow-md"
          />
          <textarea
            name="description"
            value={newTodo.description}
            onChange={handleInputChange}
            placeholder="Add todo description..."
            className="w-full p-2 mt-2 rounded border shadow-md"
          ></textarea>
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 shadow-md"
          >
            Add
          </button>
        </div>
        <div className="todo-list">
          {todos.map((todo) => (
            <div className="bg-gray-200 p-2 rounded mb-2 flex items-center" key={todo.id}>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{todo.title}</h3>
                <p>{todo.description}</p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => {
                    handleDeleteTodo(todo._id);
                    toast("Task Deleted")
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded shadow-md"
                >
                  Delete
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded shadow-md">
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
