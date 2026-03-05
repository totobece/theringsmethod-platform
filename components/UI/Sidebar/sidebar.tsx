'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

const Sidebar = () => {
  const pathname = usePathname();
  const [trialBannerHeight, setTrialBannerHeight] = useState(0);
  const { t } = useI18n();

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
      className="fixed left-0 top-16 bg-trm-black border-r border-pink/20 p-0 text-white hidden md:flex flex-col h-[calc(100vh-4rem)]"
    >
      {/* Spacer dinámico para el TrialBanner */}
      <div 
        className="shrink-0"
        style={{ height: `${trialBannerHeight}px` }}
      ></div>
      
      <h2 className="text-lg font-medium p-6 text-trm-muted">{t('sidebar.settings')}</h2>
      <ul className="flex-1 space-y-0">
        <li> 
          <Link 
            href="/account" 
            className={`block p-6 transition ${pathname === '/account' ? 'bg-pink/10 text-pink border-r-2 border-pink' : 'hover:bg-white/5 text-white'}`}
          >
            {t('sidebar.account')}
          </Link>
        </li>
        <li>
          <Link 
            href="/account/billing" 
            className={`block p-6 transition ${pathname === '/account/billing' ? 'bg-pink/10 text-pink border-r-2 border-pink' : 'hover:bg-white/5 text-white'}`}
          >
            {t('sidebar.billing')}
          </Link>
        </li>
        <li>
          <Link 
            href="/account/terms" 
            className={`block p-6 transition ${pathname === '/account/terms' ? 'bg-pink/10 text-pink border-r-2 border-pink' : 'hover:bg-white/5 text-white'}`}
          >
            {t('sidebar.terms')}
          </Link>
        </li>
        <li>
          <Link 
            href="/account/support" 
            className={`block p-6 transition ${pathname === '/account/support' ? 'bg-pink/10 text-pink border-r-2 border-pink' : 'hover:bg-white/5 text-white'}`}
          >
            {t('sidebar.support')}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
