import Navbar from '@/components/UI/Navbar/navbar';
import MainPlayRoutine from '@/components/MainPlayRoutine/main-play-routine';
import WeekVideoSlider from '@/components/WeekVideoSlider/week-video-slider';
import MeditationsComponent from '@/components/MeditationsComponent/meditations-component';
import { checkUserTrialStatus } from "@/utils/trial-check";
import { redirect } from 'next/navigation'
import Footer from '@/components/UI/Footer/footer';
import ExploreVideoSlider from "@/components/ExploreVideos/explore-videos"
import TrialBanner from '@/components/TrialBanner/trial-banner'

export default async function Home() {
  const trialStatus = await checkUserTrialStatus()
  
  if (!trialStatus.isValid) {
    redirect(trialStatus.redirect || '/login')
  }
  
  const user = trialStatus.user
  console.log('Trial status:', {
    user: user?.email,
    daysRemaining: trialStatus.daysRemaining,
    trialEndDate: trialStatus.trialEndDate
  })


  return (
    <section>
    <TrialBanner daysRemaining={trialStatus.daysRemaining} />
    <Navbar />
    <main className='bg-gray-700 to-99% '>
      
      {user ? (
        <>
          <div className='md:pt-6 md:px-6'>
          <MainPlayRoutine />
          <div className={`max-w-full relative md:text-start text-start`}>
      <h1 className='mt-12 mb-6 md:px-0 px-4 text-white font-light text-2xl md:text-3xl md:text-start text-center'>Featuring this week:</h1>

      </div>
          </div>
          
          <div className='md:pb-16 md:px-6 px-4'>
          <WeekVideoSlider />
          </div>
          
          {/* Meditaciones Section */}
          <div className="md:px-6 px-4 py-8">
            <MeditationsComponent />
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


