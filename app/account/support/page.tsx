
import Navbar from "@/components/UI/Navbar/navbar";
import Sidebar from "@/components/UI/Sidebar/sidebar";
import Support from "@/components/SupportForm/support";

export default async function SupportPage() {
  return (
    <section className="bg-trm-black max-w-full h-full min-h-screen flex flex-col overflow-y-auto">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 md:ml-[12.5%] items-center justify-center pt-16"> 
          <Support /> 
        </div>
      </div>
    </section>
  );
}
