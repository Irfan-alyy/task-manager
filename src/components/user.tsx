"use client";
import { useState, useEffect } from "react";
type User = {
  username: string;
  email: string;
  age: number;
};
export default function UserPage() {
  const [user, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("api/hello")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
        setUser(data);
      }).catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
        });
  },[]);
  if(loading) return <p>Loading...</p>;
  if (!user || user.length === 0) return <p>No users found.</p>;

  return (
    <>
      <h1>User Page</h1>
      <ul>
        {user?.map((u, index) => (
          <li key={index}>
            <p>Username: {u.username}</p>
            <p>Email: {u.email}</p>
            <p>Age: {u.age}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
