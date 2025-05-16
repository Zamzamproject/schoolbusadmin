import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import { addDoc, collection } from "firebase/firestore/lite";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function NewNotification() {
  const [errorMsg, setMsg] = useState(null);
  const router = useRouter();

  const handleAddNew = (e) => {
    e.preventDefault();        

    if(e.target.name.value === '' && e.target.message.value === ''){
        setMsg("Please enter all the required feilds")
    } else {
      addDoc(collection(database, "notifications"), {
        name: e.target.title.value,
        message: e.target.message.value,
        date: e.target.date.value,
      })
      .then(res => {
        router.push("/notifications")
      })
      .catch(error => {
        //console.log(error);
      })
    }
  }

  return (
    <div>
      <Header />
      <div className="mx-auto items-center ">
        <h3 className="text-[#fefcc0] text-xl text-center">New Notification</h3>
        <form className="max-w-sm mx-auto text-center" onSubmit={handleAddNew}>
          <div className="mb-5">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Message
            </label>
            <input
              type="text"
              id="message"
              name="message"
              className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5 "
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="boarding_time"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
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
