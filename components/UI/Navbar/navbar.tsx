'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import LogoDuo from '@/public/logo-blanco-trm.png';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector from '@/components/UI/LanguageSelector/language-selector';
import { useI18n } from '@/contexts/I18nContext';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  // Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real-time search on explore page
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const debounceTimer = setTimeout(() => {
      if (pathname === '/explore') {
        const newUrl = new URL(window.location.href);
        if (searchTerm.trim()) {
          newUrl.searchParams.set('search', searchTerm.trim());
        } else {
          newUrl.searchParams.delete('search');
        }
        router.push(newUrl.pathname + newUrl.search);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, pathname, router]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (pathname !== '/explore') {
        router.push(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
        setIsSearchOpen(false);
      }
    }
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      setSearchTerm('');
      if (pathname === '/explore') {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('search');
        router.push(newUrl.pathname + newUrl.search);
      }
    }
    setIsSearchOpen(!isSearchOpen);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav
        className={`font-montserrat fixed top-0 left-0 w-full z-[1000] border-b border-white/[0.07] transition-all duration-300 ${
          isScrolled
            ? 'bg-black/[0.92] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
            : 'bg-black/[0.55] backdrop-blur-[14px]'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo - Left */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={LogoDuo}
              alt="The Rings Method"
              width={80}
              height={34}
              className={`object-contain transition-all duration-300 ${
                isScrolled ? 'h-[26px]' : 'h-[34px]'
              }`}
              style={{ width: 'auto' }}
              priority
            />
          </Link>

          {/* Center Links - Desktop */}
          <div className="hidden lg:flex items-center gap-[2px]">
            <Link
              href="/"
              className={`text-[12px] font-semibold tracking-[1px] uppercase px-[13px] py-[7px] rounded-[30px] transition-all duration-200 ${
                pathname === '/'
                  ? 'text-pink bg-pink/[0.08]'
                  : 'text-[#ccc] hover:text-pink hover:bg-pink/[0.08]'
              }`}
            >
              {t('navbar.home')}
            </Link>
            <Link
              href="/explore"
              className={`text-[12px] font-semibold tracking-[1px] uppercase px-[13px] py-[7px] rounded-[30px] transition-all duration-200 ${
                pathname === '/explore'
                  ? 'text-pink bg-pink/[0.08]'
                  : 'text-[#ccc] hover:text-pink hover:bg-pink/[0.08]'
              }`}
            >
              {t('navbar.explore')}
            </Link>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center gap-[10px]">
            {/* Search */}
            <div className="relative flex items-center">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isSearchOpen ? 'w-48 sm:w-64 opacity-100' : 'w-0 opacity-0'
                }`}
              >
                <form onSubmit={handleSearch}>
                  <input
                    ref={searchInputRef}
                    type="search"
                    className="bg-transparent block w-full py-2 px-4 pl-9 text-sm text-white border border-white/10 rounded-[30px] outline-none placeholder-trm-muted transition-all duration-300 focus:border-pink/50"
                    placeholder={t('navbar.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-trm-muted" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                </form>
              </div>
              <button
                onClick={toggleSearch}
                className="text-trm-muted hover:text-pink pl-2 transition-all duration-200"
                aria-label="Search"
              >
                <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </button>
            </div>

            {/* User Button */}
            <Link
              href="/account"
              className="w-9 h-9 rounded-full bg-pink/[0.15] border-[1.5px] border-pink/50 flex items-center justify-center text-pink transition-all duration-200 hover:bg-pink/[0.25] hover:border-pink hover:shadow-[0_0_14px_rgba(255,107,157,0.25)]"
              aria-label="User account"
            >
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>

            {/* Language Pills */}
            <LanguageSelector />
          </div>

          {/* Hamburger - Mobile */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Search Mobile */}
            <div className="relative flex items-center">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isSearchOpen ? 'w-40 sm:w-56 opacity-100' : 'w-0 opacity-0'
                }`}
              >
                <form onSubmit={handleSearch}>
                  <input
                    ref={searchInputRef}
                    type="search"
                    className="bg-transparent block w-full py-2 px-4 pl-9 text-sm text-white border border-white/10 rounded-[30px] outline-none placeholder-trm-muted"
                    placeholder={t('navbar.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-trm-muted" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                </form>
              </div>
              <button
                onClick={toggleSearch}
                className="text-trm-muted hover:text-pink pl-1 transition-all duration-200"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </button>
            </div>

            <button
              onClick={openDrawer}
              className="flex flex-col gap-[5px] bg-transparent border-none p-1"
              aria-label="Menu"
            >
              <span className="block w-[22px] h-[2px] bg-white rounded-sm" />
              <span className="block w-[22px] h-[2px] bg-white rounded-sm" />
              <span className="block w-[22px] h-[2px] bg-white rounded-sm" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`font-montserrat fixed top-0 right-0 w-[min(300px,80vw)] h-screen bg-black/[0.97] backdrop-blur-[20px] z-[1001] pt-20 px-7 pb-10 flex flex-col gap-[6px] border-l border-pink/20 transition-all duration-[350ms] ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)' }}
      >
        {/* Close button */}
        <button
          onClick={closeDrawer}
          className="absolute top-[18px] right-5 bg-transparent border-none text-[#777] text-[26px] leading-none hover:text-pink transition-colors duration-200"
        >
          &#10005;
        </button>

        {/* Nav Links */}
        <Link
          href="/"
          className="text-[#bbb] text-[13px] font-semibold uppercase tracking-[1px] py-[10px] border-b border-white/[0.06] transition-colors duration-200 hover:text-pink"
        >
          {t('navbar.home')}
        </Link>
        <Link
          href="/explore"
          className="text-[#bbb] text-[13px] font-semibold uppercase tracking-[1px] py-[10px] border-b border-white/[0.06] transition-colors duration-200 hover:text-pink"
        >
          {t('navbar.explore')}
        </Link>

        {/* User section */}
        <Link
          href="/account"
          className="flex items-center gap-[10px] py-[10px] border-b border-white/[0.06] text-pink text-[13px] font-semibold tracking-[1px] uppercase"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span>{t('sidebar.account')}</span>
        </Link>

        {/* Settings */}
        <div className="mt-4">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-trm-muted mb-3">
            {t('sidebar.settings')}
          </p>
          <Link
            href="/account/billing"
            className="block text-[#bbb] text-[13px] font-semibold uppercase tracking-[1px] py-[10px] border-b border-white/[0.06] transition-colors duration-200 hover:text-pink"
          >
            {t('sidebar.billing')}
          </Link>
          <Link
            href="/account/terms"
            className="block text-[#bbb] text-[13px] font-semibold uppercase tracking-[1px] py-[10px] border-b border-white/[0.06] transition-colors duration-200 hover:text-pink"
          >
            {t('sidebar.terms')}
          </Link>
          <Link
            href="/account/support"
            className="block text-[#bbb] text-[13px] font-semibold uppercase tracking-[1px] py-[10px] border-b border-white/[0.06] transition-colors duration-200 hover:text-pink"
          >
            {t('sidebar.support')}
          </Link>
        </div>

        {/* Language Pills in drawer */}
        <div className="mt-5">
          <LanguageSelector />
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-[1000] transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />
    </>
  );
}
