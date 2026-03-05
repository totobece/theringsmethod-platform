'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoDuo from '@/public/logo-blanco-trm.png';
import { useI18n } from '@/contexts/I18nContext';

const scrollToContact = () => {
  const contactSection = document.getElementById('contact');

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Footer() {
  const { t } = useI18n();
  
  return (
    <footer className="relative bg-trm-black"> 
    <div className="absolute inset-0 z-[-1]"> 
      
    </div>
    <div className=" pb-12 md:pb-16 relative"> 
      <div className=" max-w-6xl mx-auto px-4 sm:px-6 ">

        
          <div className="py-12 md:py-24 md:col-span-12 lg:col-span-12 flex justify-center items-center">
              
              <Link href="/" onClick={scrollToContact} className="inline-block" aria-label="TheRingsMethod">
                <div className="w-full md:w-auto lg:w-auto">
                  <Image
                    src={LogoDuo}
                    alt='TheRingsMethod Logo'
                    width={250}
                    height={160}
                  />
                </div>
              </Link>
          </div>


     
        <div className="flex items-center md:justify-between flex-col mb-4 md:mb-0">

          <div className="mb-6 py-2 flex flex-col lg:flex-row md:order-2 font-extralight">
              <a className='text-white px-2 text-xl mx-auto hover:text-pink transition-colors'
              href="https://theringsmethod.com/"
              target='_blank'>{t('footer.aboutUs')}</a>
              <a className='text-white px-2 text-xl mx-auto hover:text-pink transition-colors'
              href="/support"
              target='_blank'>{t('footer.helpSupport')}</a>
              <a className='text-white px-2 text-xl mx-auto hover:text-pink transition-colors'
              href="https://theringsmethod.com/"
              target='_blank'>{t('footer.officialWebsite')}</a>
          </div>

          {/* Redes Sociales */}
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="text-trm-muted md:text-xl font-[200] mb-2 text-center">
              {t('footer.poweredBy')}
            </div>
            <div className="flex flex-row gap-6 font-[200] mt-2">
              <a href="https://www.instagram.com/duorings/?hl=es" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                <svg className="w-7 h-7 text-white group-hover:text-pink transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.013 7.052.072 5.77.13 4.77.31 3.97.54c-.8.23-1.48.54-2.16 1.22C1.13 2.23.82 2.91.59 3.71.36 4.51.18 5.51.12 6.79.06 8.07.05 8.47.05 12c0 3.53.01 3.93.07 5.21.06 1.28.24 2.28.47 3.08.23.8.54 1.48 1.22 2.16.68.68 1.36.99 2.16 1.22.8.23 1.8.41 3.08.47C8.07 23.95 8.47 23.96 12 23.96c3.53 0 3.93-.01 5.21-.07 1.28-.06 2.28-.24 3.08-.47.8-.23 1.48-.54 2.16-1.22.68-.68.99-1.36 1.22-2.16.23-.8.41-1.8.47-3.08.06-1.28.07-1.68.07-5.21 0-3.53-.01-3.93-.07-5.21-.06-1.28-.24-2.28-.47-3.08-.23-.8-.54-1.48-1.22-2.16-.68-.68-1.36-.99-2.16-1.22-.8-.23-1.8-.41-3.08-.47C15.93.05 15.53.04 12 .04zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.32a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
                <span className="ml-2 text-white text-xl hidden md:inline">{t('footer.socialMedia.instagram')}</span>
              </a>
              <a href="https://www.facebook.com/DuoRings/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                <svg className="w-7 h-7 text-white group-hover:text-pink transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                <span className="ml-2 text-white text-xl hidden md:inline">{t('footer.socialMedia.facebook')}</span>
              </a>
              <a href="https://www.youtube.com/@DUORINGS" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                <svg className="w-7 h-7 text-white group-hover:text-pink transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span className="ml-2 text-white text-xl hidden md:inline">{t('footer.socialMedia.youtube')}</span>
              </a>
              <a href="https://www.tiktok.com/@theringsmethod" target="_blank" rel="noopener noreferrer" className="flex items-center group">
                <svg className="w-7 h-7 text-white group-hover:text-pink transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                <span className="ml-2 text-white text-xl hidden md:inline">{t('footer.socialMedia.tiktok')}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </footer>
  )
}
