import { cookies } from "next/headers";
import TaskList from "../components/TasksList";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { verifyJwt } from "@/lib/jwt";
export default async function TasksPage() {
  const cookieStore= await cookies()
  const token= cookieStore.get("token")?.value;
  if(!token){
     
   return  <div><p className="text-red-500 text-center">You must be logged in to view tasks.</p>;
    <Link href="/login">Go To Login Page</Link></div>
  }
  const decoded= verifyJwt(token)
  
if(!decoded){
  return <div><p className="text-red-500 text-center">Invalid token or Session expired, Login Again</p>;
    <Link href="/login">Go To Login Page</Link></div>
  }
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Tasks</h1>
      <TaskList />
    </main>
  );
}
