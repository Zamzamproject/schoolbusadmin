import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore/lite";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function NewStudent() {
  const [data, setData] = useState(null);
  const [busesList, setBusesList] = useState(null);
  const [errorMsg, setMsg] = useState(null);
  const router = useRouter();
  const { student_id } = router.query;

  useEffect(() => {
    if (student_id) {
      getDoc(doc(database, "students", student_id))
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
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [student_id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    if(e.target.first_name.value === '' || e.target.last_name.value === '' || e.target.student_id.value === ''){
        setMsg("Please enter all the required feilds")
    } else if (!/^[a-zA-Z ]+$/.test(e.target.first_name.value)) {
      setMsg("Please enter a valid first name.");
    } else if (!/^[a-zA-Z ]+$/.test(e.target.last_name.value)) {
      setMsg("Please enter a valid last name.");
    } else if(!/[a-zA-Z]/.test(e.target.student_id.value) || !/\d/.test(e.target.student_id.value)){
      setMsg("Student ID must contain both letters and numbers")
    } else {
      updateDoc(doc(database, "students", student_id), {
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        gender: e.target.gender.value,
        bus_id: e.target.bus_id.value,
        student_id: e.target.student_id.value,
        position: {
          lat: e.target.lat.value,
          lng: e.target.lng.value,
        }
      })
        .then((res) => {
          router.push("/students/student/" + student_id);
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
        <h3 className="text-[#fefcc0] text-xl text-center">Edit Student</h3>
        <form className="max-w-sm mx-auto text-center" onSubmit={handleUpdate}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Student Name
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
              Student Last Name
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
              htmlFor="student_id"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Student ID
            </label>
            <input
              type="text"
              id="student_id"
              name="student_id"
              className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5 "
              required
              defaultValue={data?data.student_id:''}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="lat"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Location Latitude
            </label>
            <input
              type="text"
              id="lat"
              name="lat"
              className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5 "
              required
              defaultValue={data?data.position.lat:''}
              placeholder="23.5830525"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="lng"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Location Longitude
            </label>
            <input
              type="text"
              id="lng"
              name="lng"
              className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5 "
              required
              defaultValue={data?data.position.lng:''}
              placeholder="58.259705"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-medium text-[#fefcc0] "
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="bg-gray-50 border border-gray-300 text-[#7f0000] text-sm rounded-lg focus:ring-red-500 focus:border-blue-500 block w-full p-2.5"
              defaultValue={data?data.gender:''}
            >
              <option>Male</option>
              <option>Female</option>
            </select>
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
