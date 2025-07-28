import { jwtVerify } from "jose";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is not defined in .env.local");
}
export function signJwt(payload:{userId:ObjectId}, options={expiresIn:"1h"}){
return jwt.sign(payload, JWT_SECRET, options);
}
export function verifyJwt(token:string){
    try {
        const decoded= jwt.verify(token, JWT_SECRET)
        // console.log("Token verified:", decoded);
        return decoded;
    } catch (error) {
        console.log("Token verification failed:", error.message);
        return null;  
    }
}

export async function verifyJwtEdge(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.log('Token verification failed:', error);
    return null;
  }
}