import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore/lite";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Notifications() {
    const [notificationsList, setNotificationsList] = useState(null);
    const [updateLsit, setUpdateList] = useState(null);

    useEffect(() => {
        getDocs(collection(database ,"notifications"))
        .then(snapshots => {
            let tmpStudentList = [];
            
            snapshots.forEach(snapshot => {
                tmpStudentList.push({
                    id: snapshot.id,
                    ...snapshot.data()
                })
            })

            setNotificationsList(tmpStudentList)
        })
        .catch(err => {
            console.log(err);
        })
    }, [updateLsit])

    const handleDelete = (item) => {
      let confirm = window.confirm("Are you sure to delete this?")
  
      if(confirm){
        deleteDoc(doc(database, "notifications", item))
        .then(res => {
          setUpdateList(item)
        })
        .catch(err => {
          //
        })
      }
    }

  return (
    <div>
        <Header />
    <main className="mx-auto w-[75%]">
      <div className="mx-auto">
        <Link
            href="/notifications/new"
          className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-4 m-5 text-center "
        >
          New Notification
        </Link>
        <table className="w-full text-sm text-left text-gray-500 m-5">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Content
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {notificationsList && notificationsList.map((item, index) => <tr key={item.id} className="bg-white border-b ">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                {item.title}
                <p>{item.message}</p>
              </th>
              <td>{item.date}</td>
              <td className="px-6 py-4"><button className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 text-center" onClick={() => handleDelete(item.id)}>Delete</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      </main>
    </div>
  );
}
