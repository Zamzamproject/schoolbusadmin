import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore/lite";
import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import QRCode from "qrcode";

export default function SupervisorDetails() {
  const [data, setData] = useState(null);
  const router = useRouter();
  const { supervisor_id } = router.query;

  useEffect(() => {
    if (supervisor_id) {
      getDoc(doc(database, "supervisors", supervisor_id))
        .then((snapshot) => {
          if (snapshot.data()) {
            setData(snapshot.data());
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [supervisor_id]);

  return (
    <div>
      <Header />
      <main className="mx-auto w-[75%] bg-white print:w-full pb-[25%]">
        {data && (
          <div className="mx-auto">
            <p className="px-6 text-xl py-4 font-medium whitespace-nowrap ">
              {data.first_name} {data.last_name}
            </p>
            <p className="px-6 py-4">Bus: {data.bus_id}</p>
            <p className="px-6 py-4">E-mail: {data.email}</p>
            <p className="px-6 py-4">Mobile: {data.mobile}</p>
            <p className="px-6 py-4">Join date: {data.registration_date.toDate().toLocaleDateString("en-GB")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
