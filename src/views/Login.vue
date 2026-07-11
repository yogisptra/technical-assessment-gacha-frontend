<template>
  <div class="auth-container animate-fade-in">
    <router-link to="/" class="back-link">
      <ArrowLeft class="icon-sm" /> Back to Home
    </router-link>
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand-icon-wrapper">
          <Box class="brand-icon text-primary" />
        </div>
        <h1>Welcome Back</h1>
        <p>Enter your credentials to continue</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email address</label>
          <input type="email" class="form-control" v-model="email" required placeholder="name@example.com" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" v-model="password" required placeholder="••••••••" />
        </div>
        
        <div class="pro-error" v-if="error">{{ error }}</div>

        <button type="submit" class="pro-btn-primary full-width mt-4" :disabled="loading">
          <span v-if="loading" style="display:flex; align-items:center; justify-content:center; gap:0.5rem">
            <Loader2 class="spin" style="width:16px;height:16px" /> Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="auth-footer">
        Don't have an account? <router-link to="/register" class="auth-link">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Box, Loader2, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const API_URL = 'http://localhost:8000/api';

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: email.value,
      password: password.value
    });
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    router.push('/dashboard');
    window.location.reload();
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid credentials. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 2rem;
  position: relative;
}

.back-link {
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
}
.back-link:hover {
  color: var(--primary-color);
}
.icon-sm { width: 16px; height: 16px; }

.auth-card {
  width: 100%;
  max-width: 400px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 2.5rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-icon-wrapper {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  background-color: #e0e7ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon {
  width: 24px;
  height: 24px;
}

.auth-header h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.pro-error {
  color: var(--danger-color);
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 1rem;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.auth-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
}
.auth-link:hover {
  text-decoration: underline;
}
</style>
