import React, { useState, useEffect } from "react";
import Header from "@/parts/Header";
import {
  getDocs, query, collection, where,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore/lite";
import { useRouter } from "next/router";
import { database, firebaseConfig } from "@/parts/Database";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { deleteApp, initializeApp } from "firebase/app";

export default function NewDriver() {
  const [errorMsg, setMsg] = useState(null);
  const [busesList, setBusesList] = useState(null);
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  const handleAddNew = (e) => {
    e.preventDefault();
    if (
      e.target.first_name.value === "" ||
      e.target.last_name.value === "" || 
      e.target.email.value === "" ||
      e.target.password.value != ""
    ) {
      setMsg("Please enter all the required feilds");
    } else if (!/^[a-zA-Z ]+$/.test(e.target.first_name.value)) {
      setMsg("Please enter a valid first name.");
    } else if (!/^[a-zA-Z ]+$/.test(e.target.last_name.value)) {
      setMsg("Please enter a valid last name.");
    } else if (e.target.password.value.length < 8) {
      setMsg("Password length should be 8 characters or grater..");
    } else {
      getDocs(
        query(
          collection(database, "drivers"),
          where("email", "==", e.target.email.value),
        )
      )
        .then((res) => {
          if (res.docs.length != 0) {
            setMsg("Parent with this email already exist.");
          } else {
            const tmpTirebaseApp = initializeApp(firebaseConfig, "secondary");
            const tmpAuth = getAuth(tmpTirebaseApp);
            createUserWithEmailAndPassword(
              tmpAuth,
              e.target.email.value,
              e.target.password.value
            )
              .then((userData) => {
                let userid = userData.user.uid;
                setDoc(doc(database, "drivers", userid), {
                  first_name: e.target.first_name.value,
                  last_name: e.target.last_name.value,
                  mobile: e.target.mobile.value,
                  email: e.target.email.value,
                  bus_id: e.target.bus_id.value,
                  registration_date: serverTimestamp(),
                  enable: true,
                })
                  .then((res) => {
                    router.push("/drivers");
                    deleteApp(tmpTirebaseApp);
                  })
                  .catch((error) => {
                    setMsg("Something went wrong...");
                  });
              })
              .catch((error) => {
                setMsg("Something went wrong...");
              });
          }
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
        <h3 className="text-[#fefcc0] text-xl text-center">New Bus Driver</h3>
        <form className="max-w-sm mx-auto text-center" onSubmit={handleAddNew}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
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
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
