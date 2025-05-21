import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export default  async function SignOut() {
  
  const logout = async () => {
    "use server"
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/")
  }

  return (
    <form>
      <button formAction={logout} className="relative font-light text-base md:text-xl bg-gray-600 transition px-4 md:px-6  inline-flex h-12 animate-shimmer items-center rounded-[40px] text-white">
        Log out
      </button>
    </form>
  )
} 