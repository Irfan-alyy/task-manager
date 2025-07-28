import { TaskDetailCard } from "@/app/components/TaskDetailCard";
import { getTaskById } from "@/lib/taskService";
import { notFound } from "next/navigation";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const taskId =await  params;
  const task = await getTaskById(taskId.id);

  if (!task) return notFound();

  const taskPlain = {
    id: task._id.toString(),
    title: task.title,
    description: task.description || "",
    completed: task.completed,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    userId: task.userId?.toString(),
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <TaskDetailCard task={taskPlain} />
    </main>
  );
}
