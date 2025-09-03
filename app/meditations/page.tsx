"use client";
import React from "react";
import Navbar from "@/components/UI/Navbar/navbar";
import Footer from "@/components/UI/Footer/footer";
import MeditationsComponent from "@/components/MeditationsComponent/meditations-component";

export default function MeditationsPage() {
  return (
    <div className="min-h-screen bg-gray-700 text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Meditations</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover our collection of guided meditations to help you find
            peace, focus, and inner calm.
          </p>
        </div>

        {/* Meditations Component */}
        <MeditationsComponent showTitle={false} />
      </div>

      <Footer />
    </div>
  );
}
