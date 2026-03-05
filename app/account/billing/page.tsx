import Navbar from "@/components/UI/Navbar/navbar";
import Sidebar from "@/components/UI/Sidebar/sidebar";

export default async function AccountPage() {


  return (
    
    <section className="bg-trm-black max-w-full h-full min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1"> 
          <Sidebar/>

        <div className="flex-1 md:ml-[12.5%] mx-auto px-8 pt-24 pb-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-white text-2xl lg:text-4xl">Billing & Plans</h1>
            </div>
            <div>
              <p className="text-trm-muted text-xl font-extralight">Manage your billing and plans in our main website.</p></div>
              <div className="flex justify-start">
              <a href="https://theringsmethod.com/"
              target='_blank' className="hover:opacity-80 font-light relative bg-gradient-to-r from-pink to-dark-red transition px-6 text-xl inline-flex h-10 items-center rounded-full text-white">
                The Rings Method
              </a>
            </div>
        </div>
        
        </div>
      </div>
    </section>
  );
}
