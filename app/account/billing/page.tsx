import Navbar from "@/components/UI/Navbar/navbar";
import Sidebar from "@/components/UI/Sidebar/sidebar";

export default async function AccountPage() {


  return (
    
    <section className="bg-cream max-w-full h-full min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1"> 
          <Sidebar/>

        <div className="flex-1 md:ml-[12.5%] mx-auto px-8 pt-24 pb-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-black text-2xl lg:text-4xl">Billing & Plans</h1>
            </div>
            <div>
              <p className="text-gray-700 text-xl font-extralight">Manage your billing and plans in our main website.</p></div>
              <div className="flex justify-start">
              <a href="https://theringsmethod.com/"
              target='_blank' className="hover:underline font-light relative bg-gray-600 transition px-6 text-xl inline-flex h-10 animate-shimmer items-center rounded-[40px] text-white">
                The Rings Method
              </a>
            </div>
        </div>
        
        </div>
      </div>
    </section>
  );
}
