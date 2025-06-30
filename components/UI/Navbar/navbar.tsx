'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import LogoDuo from '@/public/images/the rings method white no bg.png';
import { useRouter } from 'next/navigation';
import  Link  from 'next/link';
import { usePathname } from 'next/navigation'; 


export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); 
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const pathname = usePathname(); 
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Búsqueda en tiempo real
  useEffect(() => {
    if (!searchTerm.trim()) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      // Solo hacer búsqueda en tiempo real si estamos en explore
      if (pathname === '/explore') {
        const newUrl = new URL(window.location.href);
        if (searchTerm.trim()) {
          newUrl.searchParams.set('search', searchTerm.trim());
        } else {
          newUrl.searchParams.delete('search');
        }
        router.push(newUrl.pathname + newUrl.search);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, pathname, router]);

  // Enfocar el input cuando se abre la búsqueda
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150); // Esperar a que termine la animación
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]); 



  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Si no estamos en explore, navegar a explore con la búsqueda
      if (pathname !== '/explore') {
        router.push(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
        // Cerrar el search bar después de navegar
        setIsSearchOpen(false);
      }
      // Si ya estamos en explore, la búsqueda en tiempo real ya se está manejando
    }
  };
  
  const toggleSearch = () => {
    if (isSearchOpen) {
      // Si estamos cerrando la búsqueda, limpiar el término
      setSearchTerm('');
      // Si estamos en explore y hay una búsqueda activa, limpiarla
      if (pathname === '/explore') {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('search');
        router.push(newUrl.pathname + newUrl.search);
      }
    }
    setIsSearchOpen(!isSearchOpen);
  };
 

  return (
    <nav className="bg-gray-700">
    <div className="h-24 items-center justify-between flex px-8">
      <div className='justify-start flex items-start '>
        <Link href="/" >
          <Image
            src={LogoDuo}
            alt='logo-duo'
            style={{ 
              objectFit: 'cover', width: '100px', height: '39px' }} 
          />
        </Link>
      </div>
      <div className="hidden lg:flex items-center justify-center flex-1">
        <Link href="/" className="text-white hover:text-gray-300 px-4 text-xl">
          Home
        </Link>
        <Link href="/explore" className="text-white hover:text-gray-200 px-4 text-xl">
          Explore
        </Link>
      </div>

      {/* Boton de busqueda */}
      <div className="relative flex items-center">
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? 'w-48 sm:w-72 opacity-100' : 'w-0 opacity-0'
          }`}>
            <form onSubmit={handleSearch} className="sm:ml-0">
              <input
                ref={searchInputRef}
                type="search"
                id="default-search"
                className="bg-gray-600 block w-full p-4 pl-10 text-sm text-cream border border-gray-600 rounded-[30px] transition-all duration-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                placeholder="Search routines and meditations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
            </form>
          </div>
          <button 
            onClick={toggleSearch} 
            className="relative text-cream hover:text-white pl-4 text-xl mt-[3px] transition-all duration-300"
          >
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </button>

          {/* Boton usuario */}
              <div className="relative px-6 mr-6">
                <Link href="/account">
                  <svg
                    className="w-9 h-9 text-cream"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 20a8 8 0 0 1-5-1.8v-.6c0-1.8 1.5-3.3 3.3-3.3h3.4c1.8 0 3.3 1.5 3.3 3.3v.6a8 8 0 0 1-5 1.8ZM2 12a10 10 0 1 1 10 10A10 10 0 0 1 2 12Zm10-5a3.3 3.3 0 0 0-3.3 3.3c0 1.7 1.5 3.2 3.3 3.2 1.8 0 3.3-1.5 3.3-3.3C15.3 8.6 13.8 7 12 7Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
               {/* Mobile menu */}
            <div className='position: absolute lg:hidden  right-0  cursor-pointer py-6'>
              <label>
                <input className="peer hidden" type="checkbox" id="mobile-menu" />
                <div
                  className="relative z-50 block h-px w-7 bg-white  content-[''] before:absolute before:top-[-0.35rem] before:z-50 before:block before:h-full before:w-full before:bg-white before:transition-all before:duration-200 before:ease-out before:content-[''] after:absolute after:right-0 after:bottom-[-0.35rem] after:block after:h-full after:w-full after:bg-white after:transition-all after:duration-200 after:ease-out after:content-[''] peer-checked:bg-transparent before:peer-checked:top-0 before:peer-checked:w-full before:peer-checked:rotate-45 before:peer-checked:transform after:peer-checked:bottom-0 after:peer-checked:w-full after:peer-checked:-rotate-45 after:peer-checked:transform"
                >
                </div>
                <div
                  className="fixed inset-0 z-40 hidden h-full w-full bg-black/50 backdrop-blur-sm peer-checked:block"
                >
                </div>
                <div
                  className="fixed top-0 right-0 z-40 h-full w-full translate-x-full transition duration-500 peer-checked:translate-x-0"
                >
                  <div className="float-right min-h-full w-[75%] bg-gray-700 px-6 py-12 shadow-2xl">
                    <menu>
                      <li className='py-6 text-cream text-xl'><Link href="/">Home</Link></li>
                      <li className='pb-6 text-cream text-xl'><Link href="/explore">Explore</Link></li>
                      <li className='border-b border-gray-600'></li>
                      <h1 className='text-xl  text-white py-4'> Settings</h1>
                      <li > 
                  <Link 
                    href="/account" 
                    className={`block p-4 transition text-white ${pathname === '/account' ? 'bg-gray-600' : ''}`}
                  >
                    Account
                  </Link>
                </li>
                <li >
                  <Link 
                    href="/account/billing" 
                    className={`block p-4 transition text-white ${pathname === '/account/billing' ? 'bg-gray-600' : ''}`}
                  >
                    Billing & Plans
                  </Link>
                </li>
                <li >
                  <Link 
                    href="/account/terms" 
                    className={`block p-4 transition text-white ${pathname === '/account/terms' ? 'bg-gray-600' : ''}`}
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/account/support" 
                    className={`block p-4 transition text-white ${pathname === '/account/support' ? 'bg-gray-600' : ''}`}
                  >
                    Support
                  </Link>
                </li>
                      
                    </menu>
                  </div>
                </div>
              </label>
              </div>
        </div>


     
    </div>
  </nav>
  );
}

