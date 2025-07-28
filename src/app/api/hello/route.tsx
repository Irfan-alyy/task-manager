import { NextRequest, NextResponse } from 'next/server'; 

const Users:{ username: string; age: number; email:string }[] = [];


export async function GET() {
  return NextResponse.json(Users);

}
export async function POST(req:NextRequest) {
  const data= await req.json();
  Users.push(data);
  return NextResponse.json({ data:Users });
}