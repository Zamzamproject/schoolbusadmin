import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { getDoc, doc } from 'firebase/firestore/lite';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, database } from './Database';
import { useRouter } from 'next/router';

export default function Header() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (userData) => {
      if (!userData) {
        router.push("/login");
      } else {
        getDoc(doc(database, "admins", userData.uid))
          .then((doc) => {
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            router.push("/login");
          });
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth)
    .then(res => {
      router.push("/login");
    })
    .catch(err => {
      //
    })
  }

  return (<div>
      {loading && (
        <div className="fixed z-50 w-full bg-[#7f0000] h-screen transition-all flex items-center justify-center">
          <img
            src="/loading.gif"
            alt="loading"
            className="mx-auto w-[5%] md:w-[5%]"
          />
        </div>
      )}
    <header>
      <nav className="px-4 lg:px-6 py-2.5 w-[76%] mx-auto">
        <div className="flex flex-wrap justify-between items-center print:items-start mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center print:items-start">
            <img
              src="/stlogo.png"
              className="mr-3 h-6 sm:h-9"
              alt="Logo"
            />
            <span className="self-center text-[#fefcc0] text-xl font-semibold whitespace-nowrap ">
              School Bus Trackers
            </span>
          </Link>
          <div className="flex items-center lg:order-2 print:hidden">
            <button
              onClick={handleLogout}
              className="text-[#fefcc0]  hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2  focus:outline-none hover:text-red-950"
            >
              Logout
            </button>
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 print:hidden"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  href="/"
                  className="block p-3 lg:py-2.5 text-[#fefcc0] hover:bg-gray-50 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 hover:text-red-950"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/parents"
                  className="block p-3 lg:py-2.5 text-[#fefcc0] hover:bg-gray-50 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 hover:text-red-950 "
                >
                  Parents
                </Link>
              </li>
              <li>
                <Link
                  href="/supervisors"
                  className="block p-3 lg:py-2.5 text-[#fefcc0] hover:bg-gray-50 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 hover:text-red-950 "
                >
                  Supervisors
                </Link>
              </li>
              <li>
                <Link
                  href="/drivers"
                  className="block p-3 lg:py-2.5 text-[#fefcc0] hover:bg-gray-50 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 hover:text-red-950 "
                >
                  Drivers
                </Link>
              </li>
              <li>
                <Link
                  href="/buses"
                  className="block p-3 lg:py-2.5 text-[#fefcc0] hover:bg-gray-50 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 hover:text-red-950 "
                >
                  Buses
                </Link>
              </li>
              <li>
                <Link
                  href="/notifications"
                  className="block p-3 lg:py-2.5 text-[#fefcc0] hover:bg-gray-50 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 hover:text-red-950 "
                >
                  Notifications
                </Link>
              </li>
              <li>
                <Link
                  href="/admins"
                  className="block p-3 lg:py-2.5 text-[#fefcc0] hover:bg-gray-50 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 hover:text-red-950 "
                >
                  Admins
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    </div>)
}
