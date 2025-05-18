import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import {
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore/lite";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function EditParent() {
  const [data, setData] = useState(null);
  const [errorMsg, setMsg] = useState(null);
  const router = useRouter();
  const { parent_id } = router.query;

  useEffect(() => {
    if (parent_id) {
      getDoc(doc(database, "parents", parent_id))
        .then((res) => {
          setData(res.data());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [parent_id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (
      e.target.first_name.value === "" ||
      e.target.last_name.value === ""
    ) {
      setMsg("Please enter all the required feilds");
    } else if (!/^[a-zA-Z ]+$/.test(e.target.first_name.value)) {
      setMsg("Please enter a valid first name.");
    } else if (!/^[a-zA-Z ]+$/.test(e.target.last_name.value)) {
      setMsg("Please enter a valid last name.");
    } else {
      updateDoc(doc(database, "parents", parent_id), {
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        mobile: e.target.mobile.value,
      })
        .then((res) => {
          router.push("/parents/");
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
        <h3 className="text-[#fefcc0] text-xl text-center">Edit Parent</h3>
        <form className="max-w-sm mx-auto text-center" onSubmit={handleUpdate}>
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
              defaultValue={data ? data.first_name : ""}
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
              defaultValue={data ? data.last_name : ""}
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
              defaultValue={data ? data.mobile : ""}
            />
          </div>

          {errorMsg && (
            <p className="text-cente m-5 p-5 text-[#fefcc0] ">{errorMsg}</p>
          )}
          <button
            type="submit"
            className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
