import React, { useState } from "react";

import { useRouter } from "next/router";
import axios from "axios";
import Header from "../components/Header";

export default function Login() {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  //user login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://vrtrip-db.vercel.app/auth/admin/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.status == "Failed") {
        alert("invalid details");
        setError("unsuccessful");
      } else {
        alert("succesful");
        setError("");
        console.log(await res.data);
        router.push("/");
      }
    } catch (err) {
      setError("unsuccessful");
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 h-screen  ">
      <Header />
      <div
        className="md:flex bg-gray-200 space-x-10 m-auto mt-20 
      w-3/5 justify-between rounded-lg shadow-xl"
      >
        <div className=" bg-white p-2">
          <h1 className="font-semibold text-lg ">
            Welcome to Driver Management Portal
          </h1>
          <p className="text-sm text-gray-300"> Powered by vraTechnologies </p>
        </div>

        {/* login form */}
        <div className=" md:w-3/5 my-5">
          <div className="flex flex-col items-center mt-2">
            <h1 className="m-auto font-semibold text-lg ">Login</h1>
          </div>
          {error && <p>{error}</p>}

          <div className="mt-5">
            <form
              onSubmit={handleLogin}
              className=" flex items-center flex-col space-y-3"
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                placeholder="Username"
                className="w-3/4 p-2 m-auto rounded-lg shadow-md outline-none text-sm"
              />

              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-3/4 p-2 m-auto rounded-lg shadow-md outline-none text-sm"
              />

              <button
                type="submit"
                className="bg-blue-500 p-2 rounded-lg text-white shadow-sm font-semibold hover:scale-105 hover:font-bold transition transfrom duration-300 ease-out "
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
