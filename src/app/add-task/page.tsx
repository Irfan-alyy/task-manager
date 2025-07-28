"use client"

import { useState } from "react";
import TaskModal from "../components/TaskModal";
import { Task } from "../components/TasksList";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; 

export default function AddTask(){
    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
    });
    
    const navigate= useRouter()
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = () => {
        if (!form.title.trim()) return;
        addTask({
          title: form.title,
          description: form.description,
          dueDate: form.dueDate || undefined,
          completed: false,
        });
        setForm({ title: "", description: "", dueDate: "" });
      };
    
 const addTask = (task: Task) => {
    fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task),
        })
        .then((response) => {
            if (!response.ok) throw new Error("Failed to add task");
            return response.json();
        })
        .then((data) => {
            console.log("Task added successfully:", data);
            task._id= data.task.insertedId
            navigate.push("/tasks")
        })
        .catch((error) => {
            console.error("Error adding task:", error);
        });
  };
    return(<>
    <motion.div
          className="flex items-center justify-center h- py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
     <motion.div
            className="bg-white rounded-xl shadow-lg p-6 w-full m-auto max-w-md"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Task</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Task title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Task description"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Add Task
              </button>
            </div>
          </motion.div>
          </motion.div>
    </>)
}