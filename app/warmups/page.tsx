'use client'
import React from 'react';
import Navbar from '@/components/UI/Navbar/navbar';
import WarmupComponent from '@/components/WarmupComponent/warmup-component';
import Footer from '@/components/UI/Footer/footer';
import { useI18n } from '@/contexts/I18nContext';

export default function WarmupsPage() {
  const { locale } = useI18n();
  
  return (
    <div className="min-h-screen bg-trm-black text-white font-montserrat">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Warm Ups</h1>
          <p className="text-trm-muted text-lg">
            {locale === 'es' ? 'Explora nuestra colección de calentamientos' : 'Explore our collection of warmups'}
          </p>
        </div>

        <div className="mb-12">
          <WarmupComponent 
            showTitle={false}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
