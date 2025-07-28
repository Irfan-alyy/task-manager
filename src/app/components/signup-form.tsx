"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { set } from "zod/v4";

export default function SignupForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
  });
  const [loading,setLoading]= useState(false)
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    // console.log("Signup form submitted:", form);
    fetch("api/signup", {body: JSON.stringify({...form, age:Number(form.age)}), method: "POST", headers: {"Content-Type": "application/json"}}).then((res) => {
      if (res.ok) {
        return res.json();
      }
      if (res.status === 409) {
        // Handle user already exists case
        toast.error("User already exists with this email or username", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setLoading(false)
        throw new Error("User already exists");
      }
      if (res.status === 400) {
        // Handle validation errors
        return res.json().then((errorData) => {
          toast.error(`Validation error: ${errorData.message}`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoading(false)
          throw new Error("Validation error");
        });
      }
    }).then((data) => {
      console.log("Signup successful:", data);
      toast.success("Signup successful! Redirecting to login page", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false)
      setTimeout(() => {  
        // Redirect to the login page after a short delay
        router.push("/login");
      }, 1000);
    }).catch((error) => {
      setLoading(false)
      console.error("Error during signup:", error);
    })

  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.username}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-600">
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.age}
            onChange={handleChange}
            placeholder="18"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          { loading? "Creating Account...":"Signup"}
        </button>
      </form>
      <div className="w-full flex " >
        <Link className="m-auto" href="/login">Already Have Account</Link>
      </div>
      <ToastContainer/>
    </div>
  );
}
