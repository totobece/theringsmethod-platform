'use client'

import React, { useState, useEffect } from 'react';
import { getCurrentWeek, rotateWeek, getWeeklyProgress } from '@/utils/weekly-rotation';

interface WeeklyProgress {
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  total: number;
}

export default function WeeklyRotationTester() {
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadCurrentWeek();
    loadWeeklyProgress();
  }, []);

  const loadCurrentWeek = async () => {
    try {
      const week = await getCurrentWeek();
      setCurrentWeek(week);
    } catch (error) {
      console.error('Error loading current week:', error);
    }
  };

  const loadWeeklyProgress = async () => {
    try {
      const progress = await getWeeklyProgress();
      setWeeklyProgress(progress);
    } catch (error) {
      console.error('Error loading weekly progress:', error);
    }
  };

  const handleRotateWeek = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await rotateWeek();
      
      if (result.success && result.currentWeek) {
        setCurrentWeek(result.currentWeek);
        setMessage(`✅ Semana rotada exitosamente a la Semana ${result.currentWeek}`);
        setMessageType('success');
      } else {
        setMessage(`❌ Error al rotar semana: ${result.error || 'Error desconocido'}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeekName = (weekNumber: number) => {
    const weekNames = {
      1: 'Primera Semana',
      2: 'Segunda Semana', 
      3: 'Tercera Semana',
      4: 'Cuarta Semana'
    };
    return weekNames[weekNumber as keyof typeof weekNames] || `Semana ${weekNumber}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🗓️ Rotación Semanal
      </h2>
      
      {/* Estado actual */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Estado Actual</h3>
        <p className="text-blue-700">
          <span className="font-medium">Semana Activa:</span> {getWeekName(currentWeek)}
        </p>
        <p className="text-sm text-blue-600 mt-1">
          Los usuarios ven las rutinas de la semana {currentWeek}
        </p>
      </div>

      {/* Progreso semanal */}
      {weeklyProgress && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">Rutinas por Semana</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Semana 1:</span>
              <span className="font-medium">{weeklyProgress.week1} rutinas</span>
            </div>
            <div className="flex justify-between">
              <span>Semana 2:</span>
              <span className="font-medium">{weeklyProgress.week2} rutinas</span>
            </div>
            <div className="flex justify-between">
              <span>Semana 3:</span>
              <span className="font-medium">{weeklyProgress.week3} rutinas</span>
            </div>
            <div className="flex justify-between">
              <span>Semana 4:</span>
              <span className="font-medium">{weeklyProgress.week4} rutinas</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-300">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{weeklyProgress.total} rutinas</span>
            </div>
          </div>
        </div>
      )}

      {/* Botón de rotación */}
      <button
        onClick={handleRotateWeek}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          isLoading
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? '🔄 Rotando...' : '🔄 Rotar a Siguiente Semana'}
      </button>

      {/* Mensaje de estado */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          messageType === 'success' ? 'bg-green-100 text-green-800' :
          messageType === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">ℹ️ Información</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• La rotación automática ocurre todos los lunes</li>
          <li>• Cada semana tiene 6 rutinas (lunes a sábado)</li>
          <li>• Hay 4 semanas en total que se repiten</li>
          <li>• Este botón es solo para testing manual</li>
        </ul>
      </div>
    </div>
  );
}
