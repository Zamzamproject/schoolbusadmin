import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import { doc, serverTimestamp, setDoc } from "firebase/firestore/lite";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function NewParent() {
  const [errorMsg, setMsg] = useState(null);
  const router = useRouter();

  const handleAddNew = (e) => {
    e.preventDefault();
    const bus_id = e.target.name.value;

    if(bus_id === ''){
      setMsg("Please enter all the required feilds")
    } else if(!/[a-zA-Z]/.test(bus_id) || !/\d/.test(bus_id)){
      setMsg("Bus ID must contain both letters and numbers")
    } else {
      setDoc(doc(database ,"buses", e.target.name.value), {
        name: bus_id,
        registration_date: serverTimestamp(),
        enable: true
      })
      .then(res => {
        router.push("/buses")
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
        <h3 className="text-[#fefcc0] text-xl text-center">New School Bus</h3>
        <form className="max-w-sm mx-auto text-center" onSubmit={handleAddNew}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Bus Id
            </label>
            <input
              type="text"
              id="name"
              name="name"
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
