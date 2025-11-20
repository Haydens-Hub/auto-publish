"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
export const LogoutButton=()=>{
  const router = useRouter()
  
  const handleLogout = async () => {
    await signOut({ redirect: false }) // Don't reload page
    router.push("/") // Manually redirect
  }

  return <button onClick={handleLogout}>Sign out</button>
}


export default LogoutButton