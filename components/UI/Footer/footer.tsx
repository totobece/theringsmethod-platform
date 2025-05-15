'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoDuo from '@/public/images/the rings method white no bg.png';

const scrollToContact = () => {
  const contactSection = document.getElementById('contact');

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-700 via-black to-darkerwine"> 
    <div className="absolute inset-0 z-[-1]"> 
      
    </div>
    <div className=" pb-12 md:pb-16 relative"> 
      <div className=" max-w-6xl mx-auto px-4 sm:px-6 ">

        
          <div className="py-12 md:py-24 md:col-span-12 lg:col-span-12 flex justify-center items-center">
              
              <Link href="/" onClick={scrollToContact} className="inline-block" aria-label="Cruip">
                <div className="w-full md:w-auto lg:w-auto">
                  <Image
                    src={LogoDuo}
                    alt='saucotec-logo'
                    width={531}
                    height={211}
                  />
                </div>
              </Link>
          </div>


     
        <div className="flex items-center md:justify-between flex-col mb-4 md:mb-0">

          <div className="mb-6 py-2 flex flex-col lg:flex-row  md:order-2 font-[200]">
              <a className='text-white px-2 text-xl mx-auto'
              href="https://theringsmethod.com/"
              target='_blank'>About Us</a>
              <a className='text-white px-2 text-xl mx-auto'
              href="/support"
              target='_blank'>Help & Support</a>
          </div>

          <div className="text-white md:text-xl font-[200] mr-2 md:mr-0 md:order-1">
            &copy; TheRingsMethod.com. All rights reserved.
          </div>

        </div>

      </div>
    </div>
  </footer>
  )
}
























