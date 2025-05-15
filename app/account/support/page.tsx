
import Navbar from "@/components/UI/Navbar/navbar";
import Sidebar from "@/components/UI/Sidebar/sidebar";
import Support from "@/components/SupportForm/support";

export default async function SupportPage() {
  return (
    <section className="bg-cream max-w-full h-full min-h-[100vh] flex flex-col overflow-y-auto">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center"> 
          <Support /> 
        </div>
      </div>
    </section>
  );
}
