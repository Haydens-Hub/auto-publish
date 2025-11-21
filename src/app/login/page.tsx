import { signIn } from "@/auth"
 
export default function LogIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
      className="flex justify-center items-center min-h-screen bg-[#5D8DCD]"
    >
      <div className="max-w-3xl p-12 mx-12 flex text-lg md:text-lg flex-col rounded-2xl text-[#3F493D] bg-[#EFEBEB] w-full shadow-md shadow-[#E6CFB8] justify-center items-center gap-6">
        <h1 className="text-4xl font-bold mb-4">Sign In to Haydens Hub</h1>
        <p className="font-medium text-lg">We use google as our authentication provider.</p>
        <button className="bg-[#5D8DCD] text-white shadow-md p-2 px-8 font-semibold rounded-xl cursor-pointer" type="submit">Sign In</button>
      </div>
      
    </form>
  )
} 