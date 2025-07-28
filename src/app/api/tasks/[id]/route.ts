import { getDb } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest, { params }: { params:Promise<{ id: string }> }) {
    const {id} = await params;
    const token= request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    jwt.verify(token, process.env.JWT_SECRET!, function(err:any, decodedToken:any) {
        if (err) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }
        console.log("User ID from token:", decodedToken); // Assuming the userId is stored in the token payload
    });

    const db = await getDb();


    try {
        const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({ task }, { status: 200});
    } catch (error) {
        return  NextResponse.json({ message: "Error fetching task", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
        
    }
}
const TaskUpdateSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    dueDate: z.string().optional(),
}).strict();

export async function PATCH(request:NextRequest, {params}:{params: Promise<{id:string}>}) {
    const {id} = await  params;
        console.log(id);
    
    try {
        const data = await request.json();
        // console.log(data,id);
        if(!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid task ID" }, { status:400});
        }
        const parsedData = TaskUpdateSchema.parse(data);
        const taskId = new ObjectId(id);
        if(Object.keys(parsedData).length === 0) {
            return NextResponse.json({ message: "No fields to update" }, { status: 400 });
        }
        const db= await getDb();
        const result= await db.collection("tasks").updateOne({ _id: taskId },{ $set: parsedData });
        // console.log("Update Result:", result);
        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Task not found" }, { status:   404});
        }
        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "No changes made to the task" }, { status: 200 });
        }
        return NextResponse.json({ message: "Task updated successfully" }, { status: 200});        


    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Invalid request",error: error instanceof z.ZodError? error.errors : error},{status:400});   
    }
}

export async function DELETE(request: NextRequest, {params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const db= await getDb()
    try {

        if(!ObjectId.isValid(id)){
            return NextResponse.json({message:"Invalid task Id"},{status:400})
        }
        const taskId= new ObjectId(id)
        const result= await db.collection("tasks").deleteOne({_id:taskId})
        console.log(result)
        if(result.deletedCount===0){
            return NextResponse.json({message:"No Task found to delete"},{status:404})
        }
        return NextResponse.json({message:"Task deleted Successfully"},{status:200})
        
    } catch (error) {
        return NextResponse.json({message:"Error occured deleting tasks",error},{status:500})
        
    }
}