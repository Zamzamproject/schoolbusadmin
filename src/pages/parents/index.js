import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore/lite";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Parents() {
  const [parentsList, setParentsList] = useState(null);
  const [updateLsit, setUpdateList] = useState(null);

  useEffect(() => {
    getDocs(collection(database, "parents"))
      .then((snapshots) => {
        let tmpStudentList = [];

        snapshots.forEach((snapshot) => {
          tmpStudentList.push({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });

        setParentsList(tmpStudentList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [updateLsit]);

  const handleDelete = (item) => {
    let confirm = window.confirm("Are you sure to delete this?");

    if (confirm) {
      deleteDoc(doc(database, "parents", item))
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
          <Link
            href="/parents/new"
            className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-4 m-5 text-center "
          >
            New Parent
          </Link>
          <table className="w-full text-sm text-left text-gray-500 m-5">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Mobile
                </th>
                <th scope="col" className="px-6 py-3">
                  E-mail
                </th>
                <th scope="col" className="px-6 py-3">
                  Registration Date
                </th>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {parentsList &&
                parentsList.map((item, index) => (
                  <tr key={item.id} className="bg-white border-b ">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      <Link href={"/students/" + item.id}>
                        {index + 1} - {item.first_name} {item.last_name}
                      </Link>
                    </th>
                    <td className="px-6 py-4">{item.mobile}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">
                      {item.registration_date.toDate().getDay() +
                        "/" +
                        (item.registration_date.toDate().getMonth() + 1) +
                        "/" +
                        item.registration_date.toDate().getFullYear()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={"/parents/edit/" + item.id}
                        className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 text-center mx-2"
                      >
                        Edit
                      </Link>
                      <Link
                        href={"/students/" + item.id}
                        className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 text-center"
                      >
                        Students
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 text-center"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
