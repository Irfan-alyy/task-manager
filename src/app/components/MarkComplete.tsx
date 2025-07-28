"use client"
export function MarkComplete(id:any){
   const markComplete= async()=>{
   const response= await fetch(`/api/tasks/${id}`,{
     method: "PATCH",
      body: JSON.stringify({completed:true})
    })
  const result= await response.json()
  console.log(result);
  }
return(
   <span
        onClick={markComplete}
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 cursor-pointer`}
        >
          Mark As Complete
        </span>
)
}