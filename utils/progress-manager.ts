import { ProgressData } from '@/utils/progress-logic';

// Singleton para manejar el progreso del usuario de forma global
class ProgressManager {
  private static instance: ProgressManager;
  private cache: ProgressData | null = null;
  private cacheTimestamp: number = 0;
  private fetchPromise: Promise<ProgressData | null> | null = null;
  private readonly CACHE_DURATION = 60000; // 1 minuto
  private listeners: Set<(data: ProgressData | null) => void> = new Set();
  private isFetching = false;

  static getInstance(): ProgressManager {
    if (!ProgressManager.instance) {
      ProgressManager.instance = new ProgressManager();
    }
    return ProgressManager.instance;
  }

  // Suscribirse a cambios en los datos
  subscribe(listener: (data: ProgressData | null) => void): () => void {
    this.listeners.add(listener);
    
    // Enviar datos actuales inmediatamente si están disponibles
    if (this.cache) {
      listener(this.cache);
    }
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notificar a todos los listeners
  private notify(data: ProgressData | null) {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('❌ ProgressManager: Error in listener:', error);
      }
    });
  }

  // Obtener datos con cache inteligente y deduplicación estricta
  async getProgress(): Promise<ProgressData | null> {
    const now = Date.now();
    
    // Usar cache si es válido (reduciendo la duración para testing)
    if (this.cache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      console.log(`📄 ProgressManager: Using cache (age: ${now - this.cacheTimestamp}ms)`);
      return this.cache;
    }

    // PROTECCIÓN ESTRICTA: Si ya hay un fetch en proceso, esperar SIN crear uno nuevo
    if (this.isFetching && this.fetchPromise) {
      console.log('⏳ ProgressManager: Already fetching, waiting for existing promise...');
      return this.fetchPromise;
    }

    // Si está fetching pero no hay promise, crear una nueva con más throttling
    if (this.isFetching) {
      console.log('⏳ ProgressManager: Fetch in progress, throttling...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Esperar más tiempo
      return this.getProgress(); // Reintentar
    }

    // Marcar que estamos fetching y crear nuevo fetch
    this.isFetching = true;
    console.log('🔄 ProgressManager: Starting new fetch...');
    this.fetchPromise = this.performFetch();

    try {
      const result = await this.fetchPromise;
      return result;
    } finally {
      // Limpiar el estado pero con delay para evitar fetches inmediatos
      setTimeout(() => {
        this.isFetching = false;
        this.fetchPromise = null;
      }, 1000); // 1 segundo de cooldown
    }
  }

  private async performFetch(): Promise<ProgressData | null> {
    try {
      console.log('🌐 ProgressManager: Making API call to /api/user/progress');
      
      const response = await fetch('/api/user/progress', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Evitar cache del browser
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('⚠️ ProgressManager: Rate limit hit, backing off...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          throw new Error('Rate limit exceeded');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Actualizar cache
      this.cache = data;
      this.cacheTimestamp = Date.now();
      
      // Notificar a todos los listeners
      this.notify(data);
      
      console.log('✅ ProgressManager: Data fetched and cached successfully');
      return data;
    } catch (error) {
      console.error('❌ ProgressManager: Error fetching progress:', error);
      this.notify(null);
      return null;
    }
  }

  // Limpiar cache manualmente
  clearCache() {
    this.cache = null;
    this.cacheTimestamp = 0;
    this.fetchPromise = null;
    this.isFetching = false;
    console.log('🗑️ ProgressManager: Cache cleared');
  }

  // Refresh forzado
  async refresh(): Promise<ProgressData | null> {
    this.clearCache();
    return this.getProgress();
  }

  // Obtener datos del cache sin hacer fetch
  getCached(): ProgressData | null {
    const now = Date.now();
    if (this.cache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.cache;
    }
    return null;
  }

  // Obtener estado de loading
  isLoading(): boolean {
    return this.isFetching;
  }
}

export default ProgressManager;
