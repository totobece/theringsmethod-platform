import SignOut from "@/components/SignOut/sign-out";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Navbar from "@/components/UI/Navbar/navbar";
import Sidebar from "@/components/UI/Sidebar/sidebar";

export default async function AccountPage() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const user = session.data?.session?.user;

  return (
    
    <section className="bg-cream max-w-full h-full min-h-screen flex flex-col overflow-y-auto">
      <Navbar />

      <div className="flex flex-1"> 

          <Sidebar/>


        <div className="flex-1 md:ml-[12.5%] mx-auto pt-24 pb-12 px-8">
          <div className="space-y-14">
            <div>
              <h1 className="text-black text-2xl lg:text-4xl">User Name</h1>
            </div>
            <div>
              <p className="text-gray-700 text-xl font-light">Email: {user?.email ?? "Guest"}</p>
              <p className="text-gray-700 text-xl font-light mt-4">Joined on: {user?.created_at ?? "Guest"}</p>
              <p className="text-gray-700 text-xl font-light mt-4">Account status: {user?.aud ?? "Guest"}</p>
            </div>
            <div className="flex justify-start">
              <a href="/new-password" className="relative font-light text-base md:text-xl bg-gray-600 transition px-2 md:px-6  inline-flex h-12 animate-shimmer items-center rounded-[40px] text-white">
                Change Password
              </a>
            </div>
            <div className="justify-start flex  text-sm">
              {user ? <SignOut /> : <Link href="/login">Login</Link>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
