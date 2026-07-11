<template>
  <div class="gacha-container">
    <h2>Event Gacha Tahun Baru</h2>
    
    <!-- Menampilkan Sisa Koin -->
    <div class="coin-info">
      <span>🪙 Koin Anda: <strong>{{ userCoins }}</strong></span>
    </div>

    <!-- Tombol Roll Gacha -->
    <button 
      @click="rollGacha" 
      :disabled="isLoading || userCoins < 10"
      class="gacha-btn"
    >
      {{ isLoading ? 'Memutar...' : 'Roll Gacha (10 Koin)' }}
    </button>

    <!-- Hasil Gacha -->
    <div v-if="result" class="result-box">
      <h3>🎉 Selamat! Anda Mendapatkan:</h3>
      <p class="prize-name">{{ result.name }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const userCoins = ref(500); 
const isLoading = ref(false);
const result = ref(null);
const eventId = 1; 

const rollGacha = async () => {
  isLoading.value = true;
  result.value = null;

  try {
    // Request gacha ke backend
    const response = await axios.post('http://localhost:8000/api/gacha', {
      event_id: eventId
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Sinkronisasi data UI
    userCoins.value -= 10;
    result.value = response.data.item;

  } catch (error) {
    alert(error.response?.data?.error || 'Gagal melakukan gacha');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.gacha-container {
  text-align: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
}
.gacha-btn {
  background-color: #ff9800;
  color: white;
  padding: 10px 20px;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}
.gacha-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.result-box {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ff9800;
  border-radius: 8px;
  background-color: #fff3e0;
}
.prize-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e65100;
}
</style>
