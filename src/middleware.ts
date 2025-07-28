
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt, verifyJwtEdge } from "./lib/jwt";

const protectedRoutes=["/tasks"];

export default async function middleware(req:NextRequest){
    // console.log("middleware");
    const path= req.nextUrl.pathname;
    const isProtectedRoute=protectedRoutes.includes(path);
    const token= req.cookies.get("token")?.value
    const decoded= await verifyJwtEdge(token as string)
    if(isProtectedRoute){
        if(!token|| ! decoded){
            return NextResponse.redirect(new URL("/login", req.nextUrl))
        }
    }

    return NextResponse.next();

}

export const config={
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}