import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const LoginSchema=z.object({
    email:z.string().email("Invalid email address").transform(val=>val.toLowerCase().trim()),
    password:z.string()
}).strict();

export async function POST(request:Request){
    const data= await request.json();
    const db= await getDb();
    try {
        const parsedData= LoginSchema.parse(data);
        const user= await db.collection("users").findOne({email:parsedData.email});
        if(!user){
            return NextResponse.json({message:"User not found"}, {status: 404});
        }
        const isPasswordValid= await bcrypt.compare(parsedData.password, user.password);
        if(!isPasswordValid){
            return NextResponse.json({message:"Invalid password"}, {status: 401});
        }
        const token= signJwt({userId:user._id},{expiresIn:"1day"})
        // Set the token in cookies
        const cookieStore= await cookies();
        cookieStore.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
        });
        return NextResponse.json({message:"Login successful", token}, {status: 200});
    } catch (error) {
        return NextResponse.json({message:"Invalid request", error: error instanceof z.ZodError ? error.errors : error}, {status: 400});  
    }

}