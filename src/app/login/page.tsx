"use client"
import { getDb } from "@/lib/mongo";
import SubmitBtn from "../components/submit-btn";

import z from "zod";
import { POST } from "../api/tasks/route";
import LoginForm from "../components/login-form";


const TaskSchema=z.object({ 
    email: z.string(),
    password:z.string().min(8,"Min password length is 8")
}).strict();

const Login = () => {
    const handleSubmit=async(e:any)=>{
        e.preventDefault()
        const form= e.target;
        const data={
            email: form.email.value,
            password:form.password.value
        }
        
        const result= await fetch("/api/login",{
            method:"POST", body:JSON.stringify(data)
        })
        const login=await result.json();
        // console.log(login)
    }

    return (<>
   <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
    </>  );
}
 
export default Login;