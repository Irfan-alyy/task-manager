"use client";
import { useRouter } from "next/navigation";

type Task = {
  id: String
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
};

export function TaskDetailCard({ task }: { task: Task }) {
  const router = useRouter();
  const markComplete= async()=>{
   const response= await fetch(`/api/tasks/${task.id}`,{
     method: "PATCH",
      body: JSON.stringify({completed:true})
    })
    if(response.ok){
      router.refresh()
    }
  const result= await response.json()
  console.log(result);
  }
  return (
    <div className="bg-white shadow-xl p-8 rounded-2xl max-w-xl w-full space-y-4 border-l-4 border-blue-500">
      <button
        onClick={() => router.back()}
        className="text-blue-600 text-sm hover:underline"
      >
        ← Back to tasks
      </button>

      <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>

      {task.description && (
        <p className="text-gray-600 leading-relaxed">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-sm text-gray-500">
          Due Date: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <div className="mt-4 flex w-full justify-between">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            task.completed
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {task.completed ? "Completed" : "Pending"}
        </span>
        {!task.completed &&
        <span
        onClick={markComplete}
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 cursor-pointer`}
        >
          Mark As Complete
        </span>}
      </div>
    </div>
  );
}
