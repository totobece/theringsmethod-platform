"use client";
import React from "react";
import Navbar from "@/components/UI/Navbar/navbar";
import Footer from "@/components/UI/Footer/footer";
import MeditationsComponent from "@/components/MeditationsComponent/meditations-component";
import { useI18n } from "@/contexts/I18nContext";

export default function MeditationsPage() {
  const { t } = useI18n();
  
  return (
    <div className="min-h-screen bg-trm-black text-white font-montserrat">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('meditations.title')}</h1>
          <p className="text-trm-muted text-lg max-w-2xl mx-auto">
            {t('meditations.description')}
          </p>
        </div>

        {/* Meditations Component */}
        <MeditationsComponent showTitle={false} />
      </div>

      <Footer />
    </div>
  );
}
