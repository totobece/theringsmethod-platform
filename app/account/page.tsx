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
    
    <section className="bg-cream max-w-full h-full min-h-[100vh] flex flex-col overflow-y-auto">
      <Navbar />

      <div className="flex flex-1"> 

          <Sidebar/>


        <div className="flex-1 max-w-[80%] mx-auto pt-8 pb-12">
          <div className="space-y-14 p-8 rounded-2xl bg-cream ">
            <div>
              <h1 className="text-black text-2xl lg:text-4xl">User Name</h1>
            </div>
            <div>
              <p className="text-gray-700 text-xl font-[300]">Email: {user?.email ?? "Guest"}</p>
              <p className="text-gray-700 text-xl font-[300] mt-4">Joined on: {user?.created_at ?? "Guest"}</p>
              <p className="text-gray-700 text-xl font-[300] mt-4">Account status: {user?.aud ?? "Guest"}</p>
            </div>
            <div className="flex justify-start">
              <a href="/new-password" className="relative font-[300] text-base md:text-xl bg-gray-600 transition px-2 md:px-6  inline-flex h-12 animate-shimmer items-center rounded-[40px] text-white">
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
