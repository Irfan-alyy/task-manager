import SubmitBtn from "../../components/submit-btn";
import { handleLogin } from "./actions";

// This component uses server actions for login
export default function LoginPage() {

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <form action={handleLogin} className="flex flex-col gap-4 w-1/2 p-4 border rounded-lg shadow-md">
        <label htmlFor="email" className="flex gap-10">
          Email:
          <input type="email" name="email" id="email" required className="border rounded w-full bg-gray-100" />
        </label>

        <label htmlFor="password" className="flex gap-10">
          Password:
          <input type="password" name="password" id="password" required className="border rounded w-full bg-gray-100" />
        </label>

        <SubmitBtn />
      </form>
    </div> );
}