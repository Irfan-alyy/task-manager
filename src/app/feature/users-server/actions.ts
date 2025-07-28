"use server";
import { signJwt } from "@/lib/jwt";
import { getDb } from "@/lib/mongo";
import z from "zod";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import path from "path";

const LoginSchema = z
    .object({
        email: z
            .string()
            .email("Invalid email address")
            .transform((val) => val.toLowerCase().trim()),
        password: z.string().min(8, "Min password length is 8"),
    })
    .strict();

export async function handleLogin(formData: FormData) {
    const loginData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const parsedData = LoginSchema.parse(loginData);
    if (!parsedData.email || !parsedData.password) {
        throw new Error("Email and password are required");
    }
    const db = await getDb();
    const user = await db.collection("users")
        .findOne({ email: parsedData.email });
    const isPasswordValid = user && (await bcrypt.compare(parsedData.password, user.password));
    if (!user || !isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    const token = signJwt(
        { userId: user._id, username: user.username },
        { expiresIn: "1h" }
    );
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: path.join("/", "users-server", "page.tsx"),
        maxAge: 60 * 60, // 1 hour
    });
    console.log("Login successful");
}
