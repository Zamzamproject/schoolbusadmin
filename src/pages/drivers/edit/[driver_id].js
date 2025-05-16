import React, { useState, useEffect } from "react";
import Header from "@/parts/Header";
import {
  getDocs,
  query,
  collection,
  where,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore/lite";
import { useRouter } from "next/router";
import { database } from "@/parts/Database";

export default function NewDriver() {
  const [errorMsg, setMsg] = useState(null);
  const [busesList, setBusesList] = useState(null);
  const [data, setData] = useState(null);
  const router = useRouter();
  const { driver_id } = router.query;

  useEffect(() => {
    if (driver_id) {
      getDoc(doc(database, "drivers", driver_id))
        .then((res) => {
          setData(res.data());
          getDocs(collection(database, "buses"))
            .then((snapshots) => {
              let tmpStudentList = [];

              snapshots.forEach((snapshot) => {
                tmpStudentList.push({
                  id: snapshot.id,
                  ...snapshot.data(),
                });
              });

              setBusesList(tmpStudentList);
            })
            .catch((err) => {
              //console.log(err);
            });
        })
        .catch((err) => {
          //console.log(err);
        });
    }
  }, [driver_id]);

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
      updateDoc(doc(database, "drivers", driver_id), {
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        mobile: e.target.mobile.value,
        bus_id: e.target.bus_id.value,
      })
        .then((res) => {
          router.push("/drivers/" + driver_id);
        })
        .catch((error) => {
          setMsg("Something went wrong...");
        });
    }
  };

  return (
    <div>
      <Header />
      <div className="mx-auto items-center ">
        <h3 className="text-[#fefcc0] text-xl text-center">Edit Bus Driver</h3>
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
              defaultValue={data?data.first_name:''}
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
              defaultValue={data?data.last_name:''}
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
              defaultValue={data?data.mobile:''}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="bus_id"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Bus ID
            </label>
            <select
              id="bus_id"
              name="bus_id"
              className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5"
              defaultValue={data?data.bus_id:''}
            >
              {busesList &&
                busesList.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
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
