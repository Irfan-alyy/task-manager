import { Suspense } from "react";
import UserComponent from "@/components/user";


export default function UserPage() {
  return (
    <div>
      <h1>User Page</h1>
      <p>This is the user page.</p>
      <Suspense fallback={<div>Loading user data...</div>}>
        <UserComponent />
      </Suspense>
    </div>
  );
}