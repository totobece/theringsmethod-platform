'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Importa usePathname para obtener el pathname actual

const Sidebar = () => {
  const pathname = usePathname(); // Obtener la ruta actual

  return (
    <div style={{ width: "12.5%" }} className="fixed left-0 top-24 bottom-0 bg-gray-700 p-0 text-white hidden md:flex flex-col h-[calc(100vh-4rem)]"> {/* Fijo en el lateral y altura completa */}
      <h2 className="text-lg font-medium p-6">Settings</h2>
      <ul className="flex-1 space-y-0"> {/* Sin espacio vertical para separar cada link con un borde */}
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
