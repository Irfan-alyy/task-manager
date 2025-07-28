import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { verifyJwt } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyJwt(token);
  if (!decoded || !decoded.userId) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
  console.log(decoded);
  
  const db = await getDb();
  const user = await db.collection("users").findOne({_id: new ObjectId(decoded.userId)},{});
  
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user }, { status: 200 });
}