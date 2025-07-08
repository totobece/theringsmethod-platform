'use client'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react';
import Navbar from '@/components/UI/Navbar/navbar';
import Footer from '@/components/UI/Footer/footer';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/contexts/I18nContext';

export default function Reset () {
    const { t } = useI18n();
    const supabase = createClient()

    const [error, setError] = useState<string | null>(null);
    const [successPassword, setSuccessPassword] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter()


    const [data, setData] = useState<{
        password: string,
        confirmPassword: string
    }>({
        password: '',
        confirmPassword:'',
    });

    const confirmPasswords = async () => {
        const {password, confirmPassword} = data;
        if (password !== confirmPassword) setError(t('auth.errorPasswordsNotMatch'));

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(t('auth.errorPasswordRequirements'));
      return;
    }

        const {data: resetData, error} = await supabase
            .auth
            .updateUser({
                password: data.password
            });
            
            setTimeout(() => {
              router.push('/');
            }, 2000);

        if (resetData) {
            setSuccessPassword(true); 
            setError(null)
        }
        if (error) {
            console.log(error);
            setError(t('auth.errorOccurredReset'))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
      <section className='bg-cream relative max-w-full h-[1000px] flex flex-col'>
      <Navbar/>

      <div className="w-full max-w-3xl m-auto px-2 pt-4 pb-12">

      <div className="w-full space-y-8 p-8 rounded-2xl bg-cream border-2 border-gray-600">

      <h1 className="text-black text-center w-full font-medium text-3xl lg:text-5xl ">
        {t('auth.resetPassword')}
          </h1>

      <form className='flex flex-col' >
        {error && <div className="text-red-500">{error}</div>}
        <div className='flex flex-col'>
          <label htmlFor="email">{t('auth.enterNewPassword')}</label>
          <input onChange={handleChange} value={data?.password} name="password" type={showPassword ? 'text' : 'password'} required className='
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
        <div className='flex flex-col'>
          <label htmlFor="password">{t('auth.confirmPassword')}</label>
          <input onChange={handleChange} value={data?.confirmPassword} name="confirmPassword" type={showPassword ? 'text' : 'password'} required 
          className=' block
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
      </form>
    
        <div className='cursor-pointer hover:underline items-start' onClick={() => setShowPassword(!showPassword)}>
          <p className='text-sm'>{showPassword ? t('auth.hidePassword') : t('auth.showPassword')}</p>
        </div>
        {successPassword && <div className='bg-green-100 text-green-600 mx-8 px-4 h-[100px]  items-center flex mt-5 rounded-xl justify-center text-xl'>{t('auth.successPasswordChanged')}</div>}
        <div className='w-full items-center justify-center flex'>
        <button onClick={confirmPasswords} className='relative w-[300px] bg-gray-600 transition px-6 text-xl inline-flex h-12  animate-shimmer items-center justify-center rounded-[40px] font-medium text-white'>{t('auth.confirm')}</button>
        </div>      
      </div>
      </div>
      <Footer/>
    </section>
    

    );
}
