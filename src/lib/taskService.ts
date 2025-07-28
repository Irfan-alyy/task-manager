// lib/taskService.ts
import { ObjectId } from "mongodb";
import { getDb } from "./mongo";
// your Mongo connection

export async function getTaskById(id: string) {
  try {
    const db = await getDb();
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });
    return task;
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return null;
  }
}
