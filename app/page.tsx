import Navbar from '@/components/UI/Navbar/navbar';
import MainPlayRoutine from '@/components/MainPlayRoutine/main-play-routine';
import WeekVideoSlider from '@/components/WeekVideoSlider/week-video-slider';
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation'
import Footer from '@/components/UI/Footer/footer';
import ExploreVideoSlider from "@/components/ExploreVideos/explore-videos"

export default async function Home() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const user = session.data?.session?.user;

  console.log('user session data', session)

  


  return (
    <section>
    <Navbar />
    <main className='bg-gradient-to-b from-gray-700 to-gray-200 to-90% '>
      
      {user ? (
        <>
          <div className='md:pt-6 md:px-6'>
          <MainPlayRoutine />
          <div className={`max-w-full relative md:text-start text-start`}>
      <h1 className='mt-28 mb-10 md:px-0 px-4 text-white font-[300] text-2xl md:text-3xl'>Featuring this week:</h1>

      </div>
          </div>
          
          <div className='md:pb-16'>
          <WeekVideoSlider />
          </div>
          <div>
            <ExploreVideoSlider/>
          </div>
          

        </>
      ) : (
            redirect('/login') 
      )}
    </main>
    <Footer/>
    </section>

  );
}


