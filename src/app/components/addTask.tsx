import { getDb } from "@/lib/mongo";
import z from "zod";
import SubmitBtn from "./submit-btn";


const TaskSchema=z.object({ 
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    completed: z.boolean().default(false),
    dueDate: z.string().optional(),
}).strict();

const Tasks = () => {
    async function AddPost(formData: FormData) {
        "use server";
        new Promise((resolve) => setTimeout(resolve, 1000));
        const title = formData.get("title");
        const duedate=formData.get("duedate");
        const formatedDate = new Date(duedate as string).toLocaleDateString("en-GB");    
        const description= formData.get("description");
        const completed = formData.get("completed") === "on" ? true : false;

        try {
            const parsedData = TaskSchema.parse({
                title: title,
                description: description,
                completed: completed,
                dueDate: formatedDate,
            });
            const db= await getDb();
            const existingTask = await db.collection("tasks").findOne({ title: parsedData.title });
            if (existingTask) {
                throw new Error("Task with this title already exists");
            }
            const result = await db.collection("tasks").insertOne(parsedData);
            console.log("Task added successfully", result);

        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation error:", error.errors);
        
            } else if (error instanceof Error) {
                console.error("Error adding task:", error.message);
                
            } else {
                console.error("Unknown error:", error);
                
            }
            
        }
    }

    return (<>
    <div className="flex flex-col h-screen w-full items-center justify-center">

    <form action={AddPost}  className="flex flex-col gap-4 w-1/2 p-4 border rounded-lg shadow-md">
        <label htmlFor="title" className="flex gap-10">
            Title:
            <input type="text" id="title" name="title" required className="border rounded w-full max-w-1/2 bg-gray-100" />
        </label>
        <br />
        <label htmlFor="description" className="flex gap-10">
            Description:
            <input type="text" id="description" name="description" required className="border rounded w-full max-w-1/2 bg-gray-100" />
        </label>
        <br />
        <label htmlFor="duedate" className="flex gap-10">
            Due Date:
            <input type="date" id="duedate" name="duedate" required className="border rounded w-full max-w-1/2 bg-gray-100" />
        </label>
        <br />
        <label htmlFor="compeleted" className="flex gap-10">
            Completed:
            <input type="checkbox" id="completed" name="completed" />
        </label>
        <br />
        <SubmitBtn/>
    </form>
    </div>

    </>  );
}
 
export default Tasks;