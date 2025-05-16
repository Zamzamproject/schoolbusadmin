import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore/lite";
import { database } from "@/parts/Database";
import Header from "@/parts/Header";
import QRCode from "qrcode";

export default function Student() {
  const [data, sepata] = useState(null);
  const [seatsHistory, setSeatsHistory] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const router = useRouter();
  const { student_id } = router.query;

  useEffect(() => {
    if (student_id) {
      getDoc(doc(database, "students", student_id))
        .then((snapshot) => {
          if (snapshot.data()) {
            sepata(snapshot.data());
            QRCode.toDataURL(snapshot.id)
              .then((url) => {
                setQrCodeImage(url);
              })
              .catch((err) => {
                console.error(err);
              });
          }
          loadStudentSeatsHistory()
        })
        .catch((err) => {
          loadStudentSeatsHistory()
          console.log(err);
        });
    }
  }, [student_id]);


  const loadStudentSeatsHistory = () => {
    getDocs(query(collection(database ,"students_history"), where("student_id", '==', student_id), orderBy("date", "desc")))
      .then((snapshots) => {
        let tmpArr = [];
        snapshots.forEach(snapshot => {
          tmpArr.push({
            id: snapshot.id,
            ...snapshot.data()
          });
        });

        setSeatsHistory(tmpArr);
      })
      .catch((err) => {
        console.log(err);
      });
    
  }

  return (
    <div>
      <Header />
      <main className="mx-auto w-[75%] bg-white print:w-full pb-[25%]">
        {data && (
          <div className="mx-auto flex">
            <div className="w-[50%]">
              <p className="px-6 text-xl py-4 font-medium whitespace-nowrap ">
                {data.first_name} {data.last_name}
              </p>
              <p className="px-6 py-4">Gender: {data.gender}</p>
              <p className="px-6 py-4">Student I.D: {data.student_id}</p>
              <p className="px-6 py-4">Bus I.D.: {data.bus_id}</p>
              <p className="px-6 py-4">Boarding Time: {data.boarding_time && data.boarding_time != '' && data.boarding_time.toDate().toLocaleString('en-GB')}</p>
              <p className="px-6 py-4">Get Off Time: {data.get_off_time && data.get_off_time != '' && data.get_off_time.toDate().toLocaleString('en-GB')}</p>
            </div>
            <div className="w-[25%]">
              {qrCodeImage && (
                <img alt="QR Code" className="w-full" src={qrCodeImage} />
              )}
              <div className="flex justify-between">
                <a className="print:hidden" href={qrCodeImage} download={true}>
                  Download Image
                </a>
                <button className="print:hidden" onClick={() => window.print()}>
                  Print
                </button>
              </div>
            </div>
          </div>
        )}
        <h3 className="mx-5 text-xl border-b-2">Student Bus History</h3>
        {seatsHistory && seatsHistory.map(item => <div className="flex m-2 mx-5" key={item.id}>
          <p>{item.checkin ? "Enter Bus" : "Leave Bus"} at {item.date.toDate().toLocaleString("en-GB")}</p>
        </div>)}
      </main>
    </div>
  );
}