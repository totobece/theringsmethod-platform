'use client'
import React, { useState, useEffect } from 'react';
import { getMeditationContent } from '@/utils/meditation-content';

interface TestResult {
  originalTitle: string;
  locale: string;
  newTitle: string;
  description: string;
  hasMapping: boolean;
}

export default function TestMeditationMapping() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const testTitles = [
      "Awareness Of Space And Breath",
      "Complete Breathing: Calm And Presence", 
      "Journey Of Light And Body Awareness",
      "4 4 4 4 Breath: Coherence And Nervous System Regulation",
      "Respiracion Completa Calma Y Presencia",
      "Viaje De Luz Y Conciencia Corporal",
      "Respiracion 4 4 4 4: Coherencia Y Regulacion Del Sistema Nervioso",
      // Nombres exactos de Supabase para meditaciones 5 y 6
      "Meditacion Atencion Plena5",
      "Meditacion Alineacion Energetica6",
      // Otras variantes
      "Recorrido Corporal",
      "Activacion Energetica",
      "Body Scan Meditation",
      "Energy Activation"
    ];

    const results = testTitles.map(title => {
      const isSpanish = title.includes('Respiracion') || title.includes('Viaje') || 
                       title.includes('Recorrido') || title.includes('Activacion') ||
                       title.includes('Meditacion') || title.includes('Atencion') ||
                       title.includes('Alineacion');
      const locale = isSpanish ? 'es' : 'en';
      
      const content = getMeditationContent(title, locale);
      
      return {
        originalTitle: title,
        locale,
        newTitle: content?.newTitle || 'No mapping found',
        description: content?.description || 'No description',
        hasMapping: !!content
      };
    });

    setTestResults(results);
  }, []);

  return (
    <div className="min-h-screen bg-gray-700 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Meditation Content Mapping</h1>
        
        <div className="space-y-6">
          {testResults.map((result, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-yellow-400">
                  Original Title ({result.locale.toUpperCase()}):
                </h3>
                <p className="text-gray-300">{result.originalTitle}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-400">
                  New Title:
                </h3>
                <p className={result.hasMapping ? "text-white font-bold" : "text-red-400"}>
                  {result.newTitle}
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-400">
                  Description:
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {result.description.substring(0, 200)}...
                </p>
              </div>
              
              <div className="text-xs">
                <span className={`px-2 py-1 rounded ${result.hasMapping ? 'bg-green-600' : 'bg-red-600'}`}>
                  {result.hasMapping ? 'MAPPED' : 'NOT MAPPED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
