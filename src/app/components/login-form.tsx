"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading]= useState(false)
    const router= useRouter();
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    console.log({ email, password });
    fetch("/api/login", {
        body: JSON.stringify({ email, password }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Login failed");
            }
            }
        ).then((data) => {
            console.log("Login successful:", data);
            toast.success("Login successful!. Redirecting to Homepage", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            localStorage.setItem("token", data.token);
            setLoading(false)
            setTimeout(() => {  
                // Redirect to the home page after a short delay
                window.location.href = "/"
            }, 1000);
        }).catch((error) => {
          setLoading(false)
            console.error("Error during login:", error);
            toast.error(`Login failed.`, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-2 rounded" />
            Remember me
          </label>
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          { loading? "Loging in...":"Login"}
        </button>
      </form>
      <div className="w-full flex " >
        <Link className="m-auto" href="/signup">Don't Have Account</Link>
      </div>
      <ToastContainer/>
    </div>
  );
}
