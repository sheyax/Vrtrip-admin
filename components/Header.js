import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

export default function Header() {

    //logout

    const logout = async () => {
      try {
        const res = await axios.post(
          `${process.env.BACKEND_URL}/auth/logout`
        );
  
        router.push("/login");
      } catch (err) {
        console.log("logout error", err);
      }
    };

  const router = useRouter();
  return (
    <div>
      <header className="bg-blue-500 text-white shadow-lg p-2 flex justify-between">
        <h1 onClick={() => router.push("/")} className="cursor-pointer">
          Driver Management Portal
        </h1>
        
        <div className="mx-2 cursor-pointer 
        hover:font-semibold duration-200 ease-out
        " onClick={logout}><h1>Logout</h1></div>
      </header>
    </div>
  );
}
