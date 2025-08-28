'use client'
import React from 'react';
import Navbar from '@/components/UI/Navbar/navbar';
import WarmupComponent from '@/components/WarmupComponent/warmup-component';
import Footer from '@/components/UI/Footer/footer';

export default function WarmupsPage() {
  return (
    <div className="min-h-screen bg-gray-700 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Warmups</h1>
          <p className="text-gray-400 text-lg">
            Explora nuestra colección de calentamientos
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
