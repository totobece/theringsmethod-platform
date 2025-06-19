'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Footer from '@/components/UI/Footer/footer';
import Navbar from '@/components/UI/Navbar/navbar';

export default function NewPasswordPage() {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter()
  const [acceptsTerms, setAcceptsTerms] = useState<boolean>(false); 

  
  const supabase = createClient();

  const handleNewPassword = async () => {
    
    try {
      
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(password)) {
        setError("The password must contain at least one uppercase letter (A-Z), one digit (0-9), and be at least 6 characters long.");
        return;
      }

      if (!acceptsTerms) {
        setError("Please accept the Terms and Conditions to proceed.");
        return;
      }

      
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        throw refreshError;
      }

      // 1. Primero actualizar la contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      // 2. DESPUÉS actualizar la metadata del trial
      const now = new Date();
      const trialEndDate = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 días

      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          trial_start_date: now.toISOString(),
          trial_end_date: trialEndDate.toISOString(),
          account_status: 'active',
          account_type: 'trial',
          source: 'gohighlevel_30day_challenge',
          challenge_type: '30_day_challenge',
          created_via: 'magic_link'
        }
      });

      if (metadataError) {
        console.error('Error updating trial metadata:', metadataError);
        // No bloqueamos el flujo por esto, solo logueamos
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error('An unexpected error occurred:', err);
      setError('An error occurred while updating the password.');
    }
  };

  
  const handleCheckboxChange = (setter: (val: boolean) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.checked);
  };
  

  return (
    <section className='bg-cream relative max-w-full h-[1000px] flex flex-col'>
    <Navbar/>

    <div className="w-full max-w-3xl m-auto px-2 pt-4 pb-12">

    <div className="w-full space-y-8 p-8  rounded-2xl bg-cream border-gray-600 border  ">

    <h1 className="text-black text-center w-full font-medium text-3xl lg:text-5xl ">
      Set a password for your user!
        </h1>

    <form className='flex flex-col' onSubmit={(e) => { e.preventDefault(); handleNewPassword(); }}>
      {error && <div className="text-red-500">{error}</div>}
      <div className='flex flex-col'>
        <label htmlFor="email">Enter your new password</label>
        <input onChange={(e) => setPassword(e.target.value)} value={password} id='password' type={showPassword ? 'text' : 'password'} required className='
                  block
                  w-full
                  my-4
                  px-16
                  py-3
                  bg-white
                  border-white
                  rounded-2xl
                  text-xl
                  shadow-sm
                  text-gray-700
                  focus:border-white
                  focus:ring
                  focus:ring-white'/>
      </div>
      <label className="flex items-center text-black">
                <input
                  type="checkbox"
                  checked={acceptsTerms}
                  onChange={handleCheckboxChange(setAcceptsTerms)}
                  className="mr-2 text-black"
                />
                 Accept  <a href='/account/terms' className='px-1 hover:underline text-black'>Terms and Conditions</a>
      </label>
      
      <div className='cursor-pointer hover:underline items-start mt-4' onClick={() => setShowPassword(!showPassword)}>
        <p className='text-sm text-black ' >Show password</p>
      </div>
      <div className='items-center justify-center flex mt-10'>
        <button type='submit' className='relative w-[300px] bg-gray-600 transition px-6 text-xl inline-flex h-12  animate-shimmer items-center justify-center rounded-[40px] font-medium text-white'>Create Password</button>
      </div>
    </form>
  
     
      {success && <div className='bg-green-100 text-green-600 mx-8 px-4 h-[100px]  items-center flex mt-5 rounded-xl justify-center text-xl'>Success! Your password has been update</div>}
      <div className='w-full items-center justify-center flex'>
      </div>      
    </div>
    </div>
    <Footer/>
  </section>
  );
}
