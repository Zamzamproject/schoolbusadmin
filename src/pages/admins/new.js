import React, { useState } from "react";
import Header from "@/parts/Header";
import { doc, serverTimestamp, setDoc } from "firebase/firestore/lite";
import { useRouter } from "next/router";
import { database, firebaseConfig } from "@/parts/Database";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { deleteApp, initializeApp } from "firebase/app";

export default function NewAdmin() {
  const [errorMsg, setMsg] = useState(null);
  const router = useRouter();

  const handleAddNew = (e) => {
    e.preventDefault();        

    if(e.target.first_name.value === '' || e.target.last_name.value === '' || e.target.email.value === '' || e.target.password.value != ''){
      setMsg("Please enter all the required feilds")
    } else if (!/^[a-zA-Z ]+$/.test(e.target.first_name.value)) {
      setMsg("Please enter a valid first name.");
    } else if (!/^[a-zA-Z ]+$/.test(e.target.last_name.value)) {
      setMsg("Please enter a valid last name.");
    } else if(e.target.password.value.length < 8){
      setMsg("Password length should be 8 characters or grater..");
    } else {
      const tmpTirebaseApp = initializeApp(firebaseConfig, "secondary");
      const tmpAuth = getAuth(tmpTirebaseApp);
      createUserWithEmailAndPassword(tmpAuth, e.target.email.value, e.target.password.value)
      .then(userData => {
        let userid = userData.user.uid;
        setDoc(doc(database ,"admins", userid), {
          first_name: e.target.first_name.value,
          last_name: e.target.last_name.value,
          email: e.target.email.value,
          registration_date: serverTimestamp(),
          enable: true
        })
        .then(res => {
          router.push("/admins")
          deleteApp(tmpTirebaseApp)
        })
        .catch(error => {
          setMsg("Something went wrong...");
        })
      })
      .catch(error => {
        setMsg("User with this email already exist.");
      })
    }
  }

  return (
    <div>
      <Header />
      <div className="mx-auto items-center ">
        <h3 className="text-[#fefcc0] text-xl text-center">New Admin</h3>
        <form className="max-w-sm mx-auto text-center" onSubmit={handleAddNew}>
          <div className="mb-5">
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="last_name"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
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

          {errorMsg && (
            <p className="text-cente m-5 p-5 text-[#fefcc0] ">{errorMsg}</p>
          )}
          <button
            type="submit"
            className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
