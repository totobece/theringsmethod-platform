'use client';

import React from 'react';
import Image from 'next/image';

interface LockedRoutineCardProps {
  routine: {
    id: string;
    title: string;
    day: string;
    duration: string;
  };
  daysUntilUnlock: number;
  className?: string;
}

const LockedRoutineCard: React.FC<LockedRoutineCardProps> = ({ 
  routine, 
  daysUntilUnlock, 
  className = '' 
}) => {
  return (
    <div className={`relative overflow-hidden rounded-xl opacity-60 ${className}`}>
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/smaller rectangle.png"
          alt="Card Background"
          fill
          className="object-cover rounded-xl"
          priority
        />
        {/* Overlay oscuro para efecto bloqueado */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
      </div>
      
      {/* Contenido por encima del fondo */}
      <div className="relative z-10 h-full flex flex-col p-5 min-h-[320px]">
        {/* Duración en la parte superior */}
        <div className='flex justify-start mb-4'>
          <div className='bg-gray-600 bg-opacity-80 w-fit px-3 py-1 flex items-center rounded-full'>
            <span className="text-sm font-light text-cream text-center">
              {routine.duration}
            </span>
          </div>
        </div>
        
        {/* Icono de candado centrado */}
        <div className='flex-1 flex justify-center items-center mb-4'>
          <div className="flex flex-col items-center text-white">
            {/* Icono de candado */}
            <svg 
              className="w-12 h-12 mb-3" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M18,8H17V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M12,3A3,3 0 0,1 15,6V8H9V6A3,3 0 0,1 12,3M18,20H6V10H18V20Z" />
            </svg>
            
            {/* Texto de desbloqueo */}
            <div className="text-center">
              <p className="text-sm font-medium mb-1">Locked</p>
              <p className="text-xs opacity-80">
                {daysUntilUnlock === 0 
                  ? 'Unlocks tomorrow' 
                  : `Unlocks in ${daysUntilUnlock} day${daysUntilUnlock > 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Título y día en la parte inferior */}
        <div className='mt-auto text-right'>
          <h3 className="text-lg lg:text-xl font-medium text-cream mb-1 opacity-75">
            {routine.title}
          </h3>
          <p className="text-base font-light text-cream opacity-60">
            {routine.day}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockedRoutineCard;
