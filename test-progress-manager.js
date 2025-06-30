// Simulación de testing del nuevo ProgressManager
// Este script simula cómo se comportaría con múltiples componentes

class MockProgressManager {
  constructor() {
    this.cache = null;
    this.cacheTimestamp = 0;
    this.CACHE_DURATION = 60000;
    this.fetchPromise = null;
    this.subscribers = new Set();
    this.fetchCount = 0;
  }

  subscribe(callback) {
    console.log(`📝 New subscriber added (total: ${this.subscribers.size + 1})`);
    this.subscribers.add(callback);
    
    const isExpired = Date.now() - this.cacheTimestamp > this.CACHE_DURATION;
    if (this.cache && !isExpired) {
      console.log(`📄 Sending cached data to new subscriber`);
      callback(this.cache, false, null);
    } else if (!this.fetchPromise) {
      console.log(`🔄 Initiating fetch for new subscriber`);
      this.fetchProgress();
    }

    return () => {
      this.subscribers.delete(callback);
      console.log(`📝 Subscriber removed (total: ${this.subscribers.size})`);
    };
  }

  notifySubscribers(data, isLoading, error) {
    console.log(`📡 Notifying ${this.subscribers.size} subscribers: loading=${isLoading}, hasData=${!!data}`);
    this.subscribers.forEach(callback => {
      callback(data, isLoading, error);
    });
  }

  async fetchProgress() {
    if (this.fetchPromise) {
      console.log(`⏳ Fetch already in progress, returning existing promise`);
      return this.fetchPromise;
    }

    this.fetchCount++;
    console.log(`🚀 Starting fetch #${this.fetchCount}`);
    this.notifySubscribers(this.cache, true, null);

    this.fetchPromise = this.simulateFetch();
    
    try {
      const result = await this.fetchPromise;
      this.cache = result;
      this.cacheTimestamp = Date.now();
      this.notifySubscribers(result, false, null);
      console.log(`✅ Fetch #${this.fetchCount} completed successfully`);
      return result;
    } catch (error) {
      console.error(`❌ Fetch #${this.fetchCount} failed:`, error);
      this.notifySubscribers(this.cache, false, error.message);
      return null;
    } finally {
      this.fetchPromise = null;
    }
  }

  async simulateFetch() {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simular datos de respuesta
    return {
      maxUnlockedDay: 3,
      progress: [
        { routine_day: 1, unlocked_at: new Date().toISOString(), completed_at: new Date().toISOString() },
        { routine_day: 2, unlocked_at: new Date().toISOString(), completed_at: null },
        { routine_day: 3, unlocked_at: new Date().toISOString(), completed_at: null }
      ]
    };
  }
}

// Test simulation
async function runTest() {
  console.log('🧪 Starting ProgressManager test simulation...\n');
  
  const manager = new MockProgressManager();
  const subscribers = [];
  
  // Simular 4 componentes montándose al mismo tiempo
  console.log('📱 Simulating 4 components mounting simultaneously...');
  for (let i = 1; i <= 4; i++) {
    const unsubscribe = manager.subscribe((data, loading, error) => {
      console.log(`  🔔 Component ${i} received: loading=${loading}, hasData=${!!data}`);
    });
    subscribers.push(unsubscribe);
  }
  
  // Esperar a que se complete el fetch
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log('\n📱 Simulating 2 more components mounting after cache is ready...');
  for (let i = 5; i <= 6; i++) {
    const unsubscribe = manager.subscribe((data, loading, error) => {
      console.log(`  🔔 Component ${i} received: loading=${loading}, hasData=${!!data}`);
    });
    subscribers.push(unsubscribe);
  }
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log('\n🗑️ Simulating components unmounting...');
  subscribers.forEach((unsubscribe, index) => {
    unsubscribe();
  });
  
  console.log(`\n📊 Test Results:`);
  console.log(`  - Total fetch calls: ${manager.fetchCount}`);
  console.log(`  - Expected: 1 (all components should share the same fetch)`);
  console.log(`  - Success: ${manager.fetchCount === 1 ? '✅' : '❌'}`);
  
  if (manager.fetchCount === 1) {
    console.log('\n🎉 Test PASSED: No infinite loops detected!');
  } else {
    console.log('\n💥 Test FAILED: Multiple fetch calls detected!');
  }
}

runTest().catch(console.error);
