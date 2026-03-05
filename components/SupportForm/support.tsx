
'use client'
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import Footer from '@/components/UI/Footer/footer';
import Navbar from '@/components/UI/Navbar/navbar';
import { useI18n } from '@/contexts/I18nContext';

function ContactForm() {
  const { t } = useI18n();
  const [state, handleSubmit] = useForm("myyqlkdn");

  if (state.succeeded) {
    return (
      <>
      <Navbar />
      <div className="px-8 py-40 bg-trm-black flex items-center justify-center h-full">
        <p className="text-4xl text-center font-semibold text-white">
        {t('support.ticketSubmitted')} <br />{t('support.teamWillContact')}
        </p>
      </div>
      <Footer/>
      </>
    );
  }


  return (
    <section id="contact" className="relative bg-trm-black">
     
      <div className="relative flex flex-col justify-center overflow-hidden pb-12 pt-12 ">
        <div className="w-full bg-trm-black p-6 m-auto rounded-lg lg:max-w-xl">
          <div>
        
      </div>
          <h1 className="text-white text-4xl lg:text-6xl">
            {t('support.contactWithSupport')}
          </h1>
          <form className="mt-6 text-left p-4 lg:p-6" onSubmit={handleSubmit}>
            <div className="mb-2">
                    <label>
                      <span className="text-trm-muted text-xl font-medium">{t('support.fullName')}</span>
                      <input
                        type="text"
                        name="name"
                      
                        className="
                        block
                        w-full
                        my-4
                        px-6
                        py-3
                        bg-trm-bg
                        border
                        border-pink/20
                        rounded-[20px]
                        text-xl
                        shadow-sm
                        text-white
                        placeholder-trm-muted
                        focus:border-pink
                        focus:ring
                        focus:ring-pink/20
                        focus:outline-none
                        "
                        
                      />
                    </label>
                  </div>
                  <div className="mb-2">
                    <label>
                      <span className="text-trm-muted text-xl font-medium" >{t('support.email')}</span>
                      <input
                        name="email"
                        type="email"
                        
                        className="
                        block
                        w-full
                        my-4
                        px-6
                        py-3
                        bg-trm-bg
                        border
                        border-pink/20
                        text-xl
                        rounded-[20px]
                        shadow-sm
                        text-white
                        placeholder-trm-muted
                        focus:border-pink
                        focus:ring
                        focus:ring-pink/20
                        focus:outline-none
                        "
                      
                        required
                      />
                    </label>
                  </div>
                  <div className="mb-2">
                    <label>
                      <span className="text-trm-muted text-xl font-medium" >{t('support.phoneNumber')}</span>
                      <input
                        name="Numero"
                        type="text"
                        
                        className="
                          block
                          w-full
                          text-xl
                          my-4
                          px-6
                          py-3
                          bg-trm-bg
                          border
                          border-pink/20
                          rounded-[20px]
                          shadow-sm
                          text-white
                          placeholder-trm-muted
                          focus:border-pink
                          focus:ring
                          focus:ring-pink/20
                          focus:outline-none
                        "
                      
                        required
                      />
                    </label>
                  </div>
                    <div className="mb-2 ">
                      <label>
                        <span className="text-trm-muted text-xl font-medium " >{t('support.yourMessage')}</span>
                        <textarea
                          name="message"
                
                          className="
                          block
                          text-xl
                          w-full
                          my-4
                          px-6
                          py-3
                          bg-trm-bg
                          border
                          border-pink/20
                          rounded-[20px]
                          shadow-sm
                          text-white
                          placeholder-trm-muted
                          focus:border-pink
                          focus:ring
                          focus:ring-pink/20
                          focus:outline-none
                          "
                        
                        ></textarea>
                      </label>
                    </div>

            <div className="mt-6">
            

 
                <button 
                className="relative hover:opacity-80 bg-gradient-to-r from-pink to-dark-red transition px-6 text-xl inline-flex h-12 items-center justify-center rounded-full font-medium text-white"
                type='submit'
                disabled={state.submitting}
                >
                  {t('support.send')}
                </button>
                
              
            </div>

            <ValidationError
              prefix="Error"
              field="submit"
              errors={state.errors}
            />
          </form>
        </div>
        </div>
    </section>
  );
}

export default ContactForm;
