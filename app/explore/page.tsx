import ExploreVideoSlider from "@/components/ExploreVideos/explore-videos"
import { checkUserTrialStatus } from "@/utils/trial-check";
import Navbar from "@/components/UI/Navbar/navbar";
import { redirect } from "next/navigation";
import Footer from "@/components/UI/Footer/footer";
import TrialBanner from '@/components/TrialBanner/trial-banner'


export default async function Explore() {

  const trialStatus = await checkUserTrialStatus()
  
  if (!trialStatus.isValid) {
    redirect(trialStatus.redirect || '/login')
  }




  return(
    <main className="relative bg-linear-to-b from-gray-500 from-15%  to-cream to-50%">
      <TrialBanner daysRemaining={trialStatus.daysRemaining} />
      <Navbar/>
    {trialStatus.user ?(
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