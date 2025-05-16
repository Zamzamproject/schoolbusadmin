import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import { addDoc, getDocs, query, collection, where, serverTimestamp } from "firebase/firestore/lite";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function NewParent() {
  const [errorMsg, setMsg] = useState(null);
  const router = useRouter();

  const handleAddNew = (e) => {
    e.preventDefault();
    if (
      e.target.first_name.value === "" ||
      e.target.last_name.value === "" || 
      e.target.email.value === ""
    ) {
      setMsg("Please enter all the required feilds");
    } else if (!/^[a-zA-Z ]+$/.test(e.target.first_name.value)) {
      setMsg("Please enter a valid first name.");
    } else if (!/^[a-zA-Z ]+$/.test(e.target.last_name.value)) {
      setMsg("Please enter a valid last name.");
    }  else {
      getDocs(
        query(
          collection(database, "parents"),
          where("email", "==", e.target.email.value),
        )
      )
      .then((res) => {
        if(res.docs.length != 0){
            setMsg("Parent with this email already exist.");
        } else {
          addDoc(collection(database, "parents"), {
            first_name: e.target.first_name.value,
            last_name: e.target.last_name.value,
            mobile: e.target.mobile.value,
            email: e.target.email.value,
            registration_date: serverTimestamp(),
            enable: true,
          })
            .then((res) => {
              router.push("/parents");
            })
            .catch((error) => {
              //console.log(error);
            });
        }
      })
      .catch((error) => {
        //console.log(error);
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="mx-auto items-center ">
        <h3 className="text-[#fefcc0] text-xl text-center">New Parent</h3>
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
              htmlFor="mobile"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Mobile
            </label>
            <input
              type="number"
              id="mobile"
              name="mobile"
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
