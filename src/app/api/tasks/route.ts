import { verifyJwt } from "@/lib/jwt";
import { getDb } from "@/lib/mongo";
import { p } from "framer-motion/client";
import { NextRequest, NextResponse, userAgent } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  console.log(request.nextUrl.toString());
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const token = request.cookies.get("token")?.value;

  // console.log(search,"search params");
  // console.log("Token from request cookies:", token);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  let decoded = verifyJwt(token);
  // console.log("Decoded from token:", decoded);
  try {
    const userId = decoded?.userId;
    const db = await getDb();
    if (search) {
      const searchRegex = new RegExp(search, "i");
      const filteredTasks = await db
        .collection("tasks")
        .find({
          $and: [
            { userId: userId },
            {
              $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
              ],
            },
          ],
        })
        .toArray();
      return NextResponse.json({ tasks: filteredTasks }, { status: 200 });
    }
    const tasks = await db
      .collection("tasks")
      .find({ userId: userId })
      .toArray();
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error fetching tasks",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

const TaskSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    completed: z.boolean().default(false),
    dueDate: z.string().optional(),
    userId: z.string(), // Assuming userId is passed in the request body
  })
  .strict();

export async function POST(request: NextRequest) {
  const data = await request.json();
  const db = await getDb();

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "No Token Provided" }, { status: 401 });
  }
  const decoded = verifyJwt(token);
  // console.log("User ID from token:", decoded);
  try {
    data.userId = decoded?.userId; // Add userId to the data being inserted
    const parsedData = TaskSchema.parse(data);
    if (!parsedData.title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }
    if (parsedData.dueDate && isNaN(Date.parse(parsedData.dueDate))) {
      return NextResponse.json(
        { message: "Invalid due date format" },
        { status: 400 }
      );
    }
    const tasks = await db
      .collection("tasks")
      .findOne({ title: parsedData.title });
    if (tasks) {
      return NextResponse.json(
        { message: "Task with this title already exists" },
        { status: 409 }
      );
    }
    const result = await db.collection("tasks").insertOne(parsedData);
    return NextResponse.json(
      { message: "Task created successfully", task: result },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid request",
        error: error instanceof z.ZodError ? error.errors : error,
      },
      { status: 400 }
    );
  }
}
