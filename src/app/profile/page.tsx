"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext";

export default function ProfilePage() {
  const {logout}= useAuth()
  const [user, setUser] = useState<{ email?: string,username:String } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile").then(res=>res.json()).then(data=>setUser(data.user))
    .catch(err=>{
        console.error(err)
    })

    
}, []);
  const handleLogout = () => {
    logout()
    router.push("/login")
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <main className="flex  min-h-[60vh]">
      <div className="flex h-full mt-auto justify-center mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">Profile</h2>
        <div className="mb-6 ">
          <div className="text-gray-700 mb-2 flex flex-col">
            <span className="font-semibold"><span className="font-bold">Username:  </span>{user.username}</span> 
            <span className="font-semibold"><span className="font-bold">Email:  </span>{user.email}</span> 
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      </div>
    </main>
  );
}