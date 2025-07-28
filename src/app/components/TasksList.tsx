"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskModal from "./TaskModal";
import Link from "next/link";
import { ObjectId } from "mongodb";
import { useSearchParams } from "next/navigation";


export type Task = {
  _id?: ObjectId
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading,setLoading]= useState(true)
  const searchParams= useSearchParams()
  const search= searchParams.get("search")
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
            // console.log("Task added successfully:", data);
            task._id= data.task.insertedId
            setTasks((prev) => [...prev, task]);
        })
        .catch((error) => {
            console.error("Error adding task:", error);
        });
    setShowModal(false);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?${search?'search='+search: ""}`, {headers: { "Content-Type": "application/json", Auhorization: `Bearer ${localStorage.getItem("token")}` },
        method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data.tasks);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete=async(id:ObjectId | undefined)=>{
    const response= await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    })
    if(response.ok){
      fetchTasks()
    }

  }

  if(loading){
    return(

      <div className="max-w-2xl mx-auto">
      <div className="flex justify-center items-center mb-4">
        Loading...
      </div>
      </div>
    )

  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Task
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {tasks.length>0?tasks.map((task, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`bg-white p-4 rounded-xl shadow flex justify-between items-start border-l-4 ${
                task.completed ? "border-green-500" : "border-yellow-500"
              }`}
            >
              <div>
                <Link href={`/tasks/${task._id}`} className="text-blue-600 hover:underline">
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                </Link>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-10">

              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  task.completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
                >
                {task.completed ? "Done" : "Pending"}
              </span>
              <span
                onClick={()=>handleDelete(task._id)}
                className={`text-sm px-3 py-1 rounded-full bg-red-400 text-black text cursor-pointer hover:bg-red-300`}
                >
                Delete
              </span>
                </div>
            </motion.div>
          )):<motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`bg-white p-4 rounded-xl shadow flex justify-between items-start border-l-4`}
            >
              <div>
                  <p className="text-sm text-gray-600 mt-1">No tasks Found</p>
                <Link href={`/add-task`} className="text-blue-600 hover:underline">
                <h3 className="text-lg font-semibold text-gray-800">Add a New Task</h3>
                </Link>
              </div>
             
            </motion.div>}
        </AnimatePresence>
      </div>

      <TaskModal show={showModal} onClose={() => setShowModal(false)} onAdd={addTask} />
    </div>
  );
}
