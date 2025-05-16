import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { auth, database } from "@/parts/Database";
import { doc, getDoc } from "firebase/firestore/lite";

export default function Login() {
    const [errorMsg, setMsg] = useState(null)
    const router = useRouter()

    const handleLogin = (e) => {
        e.preventDefault();        
    
        if(e.target.email.value === '' || e.target.password.value === ''){
            setMsg("Wrong email or password")
        } else {
          signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
          .then((userCredential) => {
            getDoc(doc(database, "admins", userCredential.user.uid))
            .then(res => {
                if(res.data()){
                    router.push('/')
                } else {
                    signOut()
                    .then(res => {
                        setMsg("Wrong email or password")
                    })
                }
            })
            .catch((error) => {
                setMsg("Wrong email or password")
            });
          })
          .catch((error) => {
            setMsg("Wrong email or password")
          });
        }
    }

  return (
    <div className="mx-auto items-center ">
      <form className="max-w-sm mx-auto text-center" onSubmit={handleLogin}>
            <img
              src="/stlogo.png"
              className="h-60 block m-auto"
              alt="Flowbite Logo"
            />
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-[#fefcc0] "
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="example@meail.com"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-[#fefcc0] "
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5 "
            required
          />
        </div>
        {errorMsg && <p className="text-cente m-5 p-5 text-[#fefcc0] ">{errorMsg}</p>}
        <button
          type="submit"
          className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
        >
          Login
        </button>
      </form>
    </div>
  );
}
