import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore/lite";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function BuseDetails() {
  const MyDate = new Date();
  const MyDateString =
    MyDate.getFullYear() +
    "-" +
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "-" +
    "01";
  const lastDay = new Date(MyDate.getFullYear(), MyDate.getMonth() + 1, 0);
  const toDateString =
    MyDate.getFullYear() +
    "-" +
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "-" +
    lastDay.getDate();

  const [fromDate, setFromDate] = useState(MyDateString);
  const [toDate, setToDate] = useState(toDateString);
  const [studentsList, setStudentsList] = useState(null);
  const [updateLsit, setUpdateList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const router = useRouter();
  const { bus_id } = router.query;

  function handleFilterHistory() {
    setStudentsList(null);
    setLoading(true);
    setMsg(null);
    if (bus_id) {
      getDocs(
        query(
          collection(database, "students"),
          where("bus_id", "==", bus_id),
          orderBy("created_at", "desc")
        )
      )
        .then((snapshots) => {
          let tmpStudentList = {};
          let stuents_ids = [];

          snapshots.forEach((snapshot) => {
            tmpStudentList = {
              [snapshot.id]: snapshot.data().name,
            };
            stuents_ids.push(snapshot.id);
          });
          getDocs(
            query(
              collection(database, "students_history"),
              where("student_id", "in", stuents_ids),
              where("date", ">=", new Date(fromDate + " 00:00:00")),
              where("date", "<=", new Date(toDate)),
              orderBy("date", "desc")
            ),
            orderBy("date", "desc"),
            limit(30)
          ).then((res) => {
            const tmpArr = [];

            res.forEach((snap) => {
              tmpArr.push({
                id: snap.id,
                name:
                  tmpStudentList && tmpStudentList[snap.data().student_id]
                    ? tmpStudentList[snap.data().student_id]
                    : "Student",
                checkin: snap.data().checkin ? "Boarding Bus" : "Get Off Bus",
                date: snap.data().date.toDate().toLocaleString("en-GB"),
              });
            });
            if (tmpArr.length != 0) {
              setStudentsList(tmpArr);
            } else {
              setMsg("No logs found, try another date...");
            }
            setLoading(false);
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }

  const handleDelete = (item) => {
    let confirm = window.confirm("Are you sure to delete this?");

    if (confirm) {
      deleteDoc(doc(database, "students_history", item))
        .then((res) => {
          setUpdateList(item);
        })
        .catch((err) => {
          //
        });
    }
  };

  return (
    <div>
      <Header />
      <main className="mx-auto w-[75%]">
        <div className="mx-auto">
          <div className="text-xl text-[#fefcc0] p-5 font-bold">
            Bus {bus_id}
          </div>
          <div className="flex">
            <label htmlFor="fromDate" className="p-2 mx-2 text-[#fefcc0]">
              From
            </label>
            <input
              type="date"
              name="fromDate"
              id="fromDate"
              onChange={(val) => setFromDate(val.target.value)}
              className="text-[rgb(127,0,0)] bg-[#ffffff] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 mx-2 text-center "
              value={fromDate}
            />
            <label htmlFor="toDate" className="p-2 mx-2 text-[#fefcc0]">
              To
            </label>
            <input
              type="date"
              name="toDate"
              id="toDate"
              onChange={(val) => setToDate(val.target.value)}
              className="text-[#7f0000] bg-[#ffffff] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 mx-2 text-center "
              value={toDate}
            />
            <button
              className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 mx-2 text-center "
              onClick={handleFilterHistory}
            >
              Display
            </button>
          </div>
          {msg && <p className="m-5 p-5 text-[#fefcc0] text-center">{msg}</p>}
          {loading && (
            <div className="bg-[#7f0000] transition-all flex items-center justify-center">
              <img
                src="/loading.gif"
                alt="loading"
                className="mx-auto w-[5%] md:w-[5%]"
              />
            </div>
          )}
          {studentsList && (
            <table className="w-full text-sm text-left text-gray-500 m-5">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map((item, index) => (
                  <tr key={item.id} className="bg-white border-b ">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {item.name}
                    </th>
                    <td className="px-6 py-4">{item.checkin}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 text-center "
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
