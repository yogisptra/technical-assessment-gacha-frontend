<template>
  <div id="app">
    <nav class="pro-nav" v-if="isAuthenticated">
      <div class="nav-container">
        <div class="nav-mobile-header">
          <div class="nav-brand">
            <Box class="brand-icon" />
            <span>Gacha</span>
          </div>
          
          <button class="mobile-nav-toggle" @click="isNavOpen = !isNavOpen">
            <Menu v-if="!isNavOpen" class="icon" style="width:24px;height:24px" />
            <X v-else class="icon" style="width:24px;height:24px" />
          </button>
        </div>

        <div class="nav-content" :class="{ 'mobile-hidden': !isNavOpen }">
          <div class="nav-links">
            <router-link to="/dashboard" class="nav-item" @click="isNavOpen = false">Overview</router-link>
            <router-link v-if="isAdmin" to="/admin" class="nav-item" @click="isNavOpen = false">Dashboard</router-link>
          </div>
          <div class="nav-actions">
            <button @click="logout" class="pro-btn-outline btn-sm">Log out</button>
          </div>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Box, Menu, X } from 'lucide-vue-next';

const router = useRouter();
const isNavOpen = ref(false);

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token');
});

const isAdmin = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user && user.is_admin;
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
</script>

<style scoped>
.pro-nav {
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-card);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-sm);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--primary-color);
}

.brand-icon {
  width: 22px;
  height: 22px;
}

.mobile-nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
}

.nav-content {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  margin-left: 3rem;
}

.nav-mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 1rem 1.5rem;
    align-items: stretch;
  }
  
  .nav-mobile-header {
    width: 100%;
  }

  .mobile-nav-toggle {
    display: block;
  }
  
  .nav-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-top: 1rem;
    padding: 0.5rem 0;
  }
  
  .nav-content.mobile-hidden {
    display: none;
  }
  
  .nav-links {
    margin-left: 0;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }
  
  .nav-item {
    padding: 0.25rem 0;
  }
  
  .nav-actions {
    width: 100%;
  }
  
  .nav-actions button {
    width: 100%;
  }
}

.nav-item {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-item:hover, .nav-item.router-link-active {
  color: var(--primary-color);
  font-weight: 600;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.btn-sm {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
}

.main-content {
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}
</style>
