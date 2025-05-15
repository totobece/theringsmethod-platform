
'use client'
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import Footer from '@/components/UI/Footer/footer';
import Navbar from '@/components/UI/Navbar/navbar';

function ContactForm() {
  const [state, handleSubmit] = useForm("myyqlkdn");

  if (state.succeeded) {
    return (
      <>
      <Navbar />
      <div className="px-8 py-40 bg-gray-700 flex items-center justify-center h-full">
        <p className="text-4xl text-center font-semibold text-white">
        Ticket submitted! <br />Our team will contact you soon.
        </p>
      </div>
      <Footer/>
      </>
    );
  }


  return (
    <section id="contact" className="relative bg-cream">
     
      <div className="relative flex flex-col justify-center  overflow-hidden pb-12 pt-12 ">
        <div className="w-full bg-cream p-6 m-auto rounded-lg  lg:max-w-xl">
          <div>
        
      </div>
          <h1 className="text-gray-600 text-4xl lg:text-6xl">
            Contact with Support
          </h1>
          <form className="mt-6 text-left p-4 lg:p-6" onSubmit={handleSubmit}>
            <div className="mb-2">
                    <label>
                      <span className="text-gray-600 text-xl font-[500]">*Full Name</span>
                      <input
                        type="text"
                        name="name"
                      
                        className="
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
                        focus:ring-white
                        "
                        
                      />
                    </label>
                  </div>
                  <div className="mb-2">
                    <label>
                      <span className="text-gray-600 text-xl font-[500]" >*Email</span>
                      <input
                        name="email"
                        type="email"
                        
                        className="
                        block
                        w-full
                        my-4
                        px-16
                        py-3
                        bg-white
                        border-white
                        text-xl
                        rounded-2xl
                        shadow-sm
                        text-gray-700
                        focus:border-white
                        focus:ring
                        focus:ring-white
                        "
                      
                        required
                      />
                    </label>
                  </div>
                  <div className="mb-2">
                    <label>
                      <span className="text-gray-600 text-xl font-[500]" >*Phone number</span>
                      <input
                        name="Numero"
                        type="text"
                        
                        className="
                          block
                          w-full
                          text-xl
                          my-4
                          px-16
                          py-3
                          bg-white
                          border-white
                          rounded-2xl
                          shadow-sm
                          text-gray-700
                          focus:border-white
                          focus:ring
                          focus:ring-white
                        "
                      
                        required
                      />
                    </label>
                  </div>
                    <div className="mb-2 ">
                      <label>
                        <span className="text-gray-600 text-xl font-[500] " >Your message</span>
                        <textarea
                          name="message"
                
                          className="
                          block
                          text-xl
                          w-full
                          my-4
                          px-16
                          py-3
                          bg-white
                          border-white
                          rounded-2xl
                          shadow-sm
                          text-gray-700
                          focus:border-white
                          focus:ring
                          focus:ring-white
                          "
                        
                        ></textarea>
                      </label>
                    </div>

            <div className="mt-6">
            

 
                <button 
                className="relative hover:-translate-x-[-12px] bg-gray-600 transition px-6 text-xl inline-flex h-12  animate-shimmer items-center justify-center rounded-[40px] font-medium text-white "
                type='submit'
                disabled={state.submitting}
                >
                  Send
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
