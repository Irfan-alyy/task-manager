import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import {z} from "zod";
import bcrypt from "bcrypt"
// export async function GET(){
//     const db= await getDb();
//     const users= await db.collection("users").find().toArray();
//     console.log("Users fetched:", users);
//     return NextResponse.json(users);
// }
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UserSchema= z.object({
    username:z.string().min(3, "Username must be at least 3 characters long"),
    email:z.string().email("Invalid email address").transform(val=>val.toLowerCase().trim()),
    age:z.number().int().positive("Age must be a positive integer").min(12, "Age must be at least 12"),
    password:z.string().regex(passwordRegex,"Password must be at least 8 characters and include uppercase, lowercase, number, and special character.").min(6, "Password must be at least 6 characters long"),
}).strict();


export async function POST(request:Request){
    const db = await getDb();
    const data = await request.json();
    // console.log("Data received:", data);

    try {
        const parsedData = UserSchema.parse(data);
        // console.log("Parsed data:", parsedData);
        const user= await db.collection("users").findOne({$or:[{email: parsedData.email},{username: parsedData.username}]});
        if(user){
            return NextResponse.json({message:"User already exists with this email or username"}, {status: 409});
        }
        const hashedPassword= await bcrypt.hash(parsedData.password, 10);
        // console.log("Hashed password:", hashedPassword);
        const newUser={
            ...parsedData, password:hashedPassword
        }
        const result= await db.collection("users").insertOne(newUser);
        return NextResponse.json({message:"User created successfully", userId: result.insertedId}, {status: 201});
    } catch (error: any) {
        if(error instanceof z.ZodError){
            console.error("Validation error:", error.errors);
            return NextResponse.json({message:"Validation error", errors: error.errors},{status: 400});
        }else{
            return NextResponse.json({message:"Internal server error", error: error.message},{status: 500});
        }
    }
}