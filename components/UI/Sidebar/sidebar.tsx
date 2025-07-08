'use client'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogoDuo from '@/public/logo-blanco-trm.png';

const Sidebar = () => {
  const pathname = usePathname();
  const [trialBannerHeight, setTrialBannerHeight] = useState(0);

  useEffect(() => {
    // Función para detectar la altura del TrialBanner
    const detectTrialBannerHeight = () => {
      const trialBanner = document.querySelector('[data-trial-banner]');
      if (trialBanner) {
        setTrialBannerHeight(trialBanner.getBoundingClientRect().height);
      } else {
        setTrialBannerHeight(0);
      }
    };

    // Detectar al cargar
    detectTrialBannerHeight();

    // Observer para detectar cambios en el DOM
    const observer = new MutationObserver(detectTrialBannerHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // También escuchar resize por si acaso
    window.addEventListener('resize', detectTrialBannerHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', detectTrialBannerHeight);
    };
  }, []);

  return (
    <div 
      style={{ width: "12.5%" }} 
      className="fixed left-0 top-0 bg-gray-700 p-0 text-white hidden md:flex flex-col h-screen pt-24"
    >
      {/* Logo de The Rings Method - mismo tamaño y posición que en navbar */}
      <div className="absolute top-0 left-0 h-24 flex items-center justify-start px-8">
        <Link href="/">
          <Image
            src={LogoDuo}
            alt='logo-duo'
            width={120}
            height={45}
            style={{ 
              objectFit: 'contain',
              width: 'auto',
              height: '45px',
              maxWidth: '120px'
            }} 
          />
        </Link>
      </div>

      {/* Spacer dinámico para el TrialBanner */}
      <div 
        className="shrink-0"
        style={{ height: `${trialBannerHeight}px` }}
      ></div>
      
      <h2 className="text-lg font-medium p-6">Settings</h2>
      <ul className="flex-1 space-y-0">
        <li > 
          <Link 
            href="/account" 
            className={`block p-6 transition ${pathname === '/account' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
          >
            Account
          </Link>
        </li>
        <li >
          <Link 
            href="/account/billing" 
            className={`block p-6 transition ${pathname === '/account/billing' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
          >
            Billing & Plans
          </Link>
        </li>
        <li >
          <Link 
            href="/account/terms" 
            className={`block p-6 transition ${pathname === '/account/terms' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
          >
            Terms & Conditions
          </Link>
        </li>
        <li>
          <Link 
            href="/account/support" 
            className={`block p-6 transition ${pathname === '/account/support' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
          >
            Support
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
