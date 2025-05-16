import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore/lite";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Students() {
    const [studentsList, setStudentsList] = useState(null);
    const [updateLsit, setUpdateList] = useState(null);
    const router = useRouter()
    const { parent } = router.query;

    useEffect(() => {
      if(parent){
        getDocs(query(collection(database ,"students"), where("parent_id", '==', parent), orderBy("created_at", "desc")))
        .then(snapshots => {
            let tmpStudentList = [];
            
            snapshots.forEach(snapshot => {
                tmpStudentList.push({
                    id: snapshot.id,
                    ...snapshot.data()
                })
            })

            setStudentsList(tmpStudentList)
        })
        .catch(err => {
            console.log(err);
        })
      }
    }, [updateLsit, parent])

  const handleDelete = (item) => {
    let confirm = window.confirm("Are you sure to delete this?")

    if(confirm){
      deleteDoc(doc(database, "students", item))
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
            href={"/students/new/"+parent}
          className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-4 m-5 text-center "
        >
          New Student
        </Link>
        <table className="w-full text-sm text-left text-gray-500 m-5">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Gender
              </th>
              <th scope="col" className="px-6 py-3">
                Student ID
              </th>
              <th scope="col" className="px-6 py-3">
                Bus Id
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {studentsList && studentsList.map((item, index) => <tr key={item.id} className="bg-white border-b ">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                <Link href={"/students/student/"+item.id}>{(index + 1)} - {item.first_name} {item.last_name}</Link>
              </th>
              <td className="px-6 py-4">{item.gender}</td>
              <td className="px-6 py-4">{item.student_id}</td>
              <td className="px-6 py-4">{item.bus_id}</td>
              <td className="px-6 py-4 flex">
                <Link href={"/students/edit/"+item.id} className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 text-center mx-3">Edit</Link>
                <button className="text-[#7f0000] bg-[#fefcc0] hover:bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg p-2 text-center " onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
      </main>
    </div>
  );
}
