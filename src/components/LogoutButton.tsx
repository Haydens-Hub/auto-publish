"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
export const LogoutButton=()=>{
  const router = useRouter()
  
  const handleLogout = async () => {
    await signOut({ redirect: false }) // Don't reload page
    router.push("/") // Manually redirect
  }

  return <button className="bg-gray-800 text-white shadow-md p-2 px-8 font-semibold rounded-xl cursor-pointer" type="submit" onClick={handleLogout}>Log Out</button>
}


export default LogoutButton