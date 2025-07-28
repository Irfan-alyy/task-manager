"use client"

import { useFormStatus } from "react-dom";

const SubmitBtn = () => {
    const {pending}= useFormStatus();
    return (<>
    <button type="submit" disabled={pending} className="px-10 py-5 bg-blue-500 w-fit m-auto rounded-xl text-amber-50 hover:cursor-pointer hover:bg-blue-600 disabled:bg-blue-100 disabled:text-black">{pending? "Submitting Form":"Submit"}</button>
    </>  );
}
 
export default SubmitBtn;