import ExploreVideoSlider from "@/components/ExploreVideos/explore-videos"
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/UI/Navbar/navbar";
import { redirect } from "next/navigation";
import Footer from "@/components/UI/Footer/footer";


export default async function Explore() {

  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const user = session.data?.session?.user;




  return(
    <main className="relative bg-gradient-to-b from-gray-500 from-15%  to-cream to-50%">
      <Navbar/>
    {user ?(
    <>
    <ExploreVideoSlider/>
    <Footer/>

    </>
    ) : (
      redirect('/login')
    )}
      
    </main>
  );
}