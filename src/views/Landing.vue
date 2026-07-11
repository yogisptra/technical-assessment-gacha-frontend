<template>
  <div class="landing-page animate-fade-in">
    <div class="hero-section">
      <div class="brand-icon-wrapper-large">
        <Box class="brand-icon-large text-primary" />
      </div>
      <h1 class="hero-title">Welcome to the <span class="text-primary">Ultimate Gacha</span></h1>
      <p class="hero-subtitle">
        Platform gacha terbaik untuk para kolektor sejati! Kumpulkan koin, coba keberuntunganmu, dan dapatkan karakter serta item legendaris untuk melengkapi koleksi eksklusifmu.
      </p>
      
      <div class="cta-buttons">
        <template v-if="isAuthenticated">
          <router-link to="/dashboard" class="pro-btn-primary btn-lg">
            Masuk ke Game (Dashboard)
            <ArrowRight class="icon-sm" style="margin-left: 0.5rem;" />
          </router-link>
        </template>
        <template v-else>
          <router-link to="/register" class="pro-btn-primary btn-lg">
            Daftar Sekarang
            <span class="bonus-badge">Free 500 Koin</span>
          </router-link>
          <router-link to="/login" class="pro-btn-outline btn-lg">
            Masuk
          </router-link>
        </template>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="icon-circle bg-success-light">
          <Gamepad2 class="feature-icon text-success" />
        </div>
        <h3>Koleksi Karakter & Item</h3>
        <p>Buka peti harta karun dan kumpulkan ratusan item unik, dari tingkat <i>Common</i> hingga <i>Super Super Rare (SSR)</i> yang diidam-idamkan semua pemain.</p>
      </div>
      <div class="feature-card">
        <div class="icon-circle bg-primary-light">
          <Sparkles class="feature-icon text-primary" />
        </div>
        <h3>Animasi & Pengalaman Seru</h3>
        <p>Rasakan sensasi ketegangan setiap kali melakukan <i>Roll</i>. Apakah kamu akan mendapatkan item sampah, atau justru <i>Jackpot</i> yang sangat langka?</p>
      </div>
      <div class="feature-card">
        <div class="icon-circle bg-accent-light">
          <Trophy class="feature-icon text-accent" />
        </div>
        <h3>Event Terbatas</h3>
        <p>Ikuti <i>Grand Opening</i>, <i>Summer Festival</i>, dan berbagai misi bulanan. Dapatkan koin gratis dan <i>gacha</i> sepuasnya tanpa batas!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Box, Gamepad2, Sparkles, Trophy, ArrowRight } from 'lucide-vue-next';

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token');
});
</script>

<style scoped>
.landing-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-section {
  text-align: center;
  max-width: 800px;
  margin-bottom: 5rem;
}

.brand-icon-wrapper-large {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.5rem;
  background-color: #e0e7ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.brand-icon-large {
  width: 36px;
  height: 36px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.hero-subtitle {
  font-size: 1.15rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  padding: 0 1rem;
}

.cta-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-lg {
  padding: 0.85rem 2rem;
  font-size: 1.1rem;
  border-radius: 9999px; /* Pill shape */
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.bonus-badge {
  background-color: #fef08a;
  color: #854d0e;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  letter-spacing: 0.05em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 2.5rem;
  }
}

.feature-card {
  background-color: var(--bg-card);
  padding: 2.5rem 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.bg-success-light { background-color: #dcfce7; }
.bg-primary-light { background-color: #e0e7ff; }
.bg-accent-light { background-color: #cffafe; }
.text-accent { color: #0891b2; }

.feature-card h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
