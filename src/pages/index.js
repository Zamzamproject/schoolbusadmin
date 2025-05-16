import Header from "@/parts/Header";

export default function Home() {
  return (<div>
    <Header />
    <main className="mx-auto w-[75%]">
      <div className="flex">
        <div className="w-[45%">
          <img src="/app_welcome.png" className="w-full" />
        </div>
        <div className="w-[50%] text-[#fefcc0]">
          <h3 className="text-2xl mt-5">Welcome to School Bus Tracker</h3>
          <p className="m-10">This admin dashboard allows you to add studnts and staff to use and operate the mobile app.</p>
          <p className="m-10">- To add a new student first add the pernent the you can add the student inside the parent to link them together and or parent to find all his children student inside his account.</p>
          <p className="m-10">- Adding a new supervisor or a bus driver will also create the account credintioal for them to login and use the mobile application later.</p>
          <p className="m-10">- Creating available school buses will enable you to link any but to the student of the staff.</p>

        </div>
      </div>

    </main>
  </div>);
}
