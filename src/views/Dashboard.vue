<template>
  <div class="pro-dashboard">
    <div class="pro-header animate-fade-in">
      <div class="user-greeting">
        <h1>Welcome, {{ user?.name }}</h1>
        <p>Manage your items and roll for new rewards.</p>
      </div>
      <div class="balance-card">
        <div class="balance-info">
          <span class="balance-label">Available Balance</span>
          <span class="balance-value">{{ user?.coins }} <span class="currency">Coins</span></span>
        </div>
        <Coins class="balance-icon" />
      </div>
    </div>

    <div class="pro-grid">
      <!-- Gacha Action Section -->
      <div class="pro-card gacha-card animate-fade-in" style="animation-delay: 0.1s">
        <div class="card-header">
          <Dices class="header-icon" />
          <h2>Gacha Roll</h2>
        </div>
        
        <div class="card-body">
          <div class="form-group" v-if="events.length > 0">
            <label>Select Event</label>
            <div class="select-wrapper">
              <select v-model="selectedEvent" class="form-control">
                <option v-for="event in events" :key="event.id" :value="event.id">
                  {{ event.name }}
                </option>
              </select>
            </div>
          </div>
          <div v-else class="pro-empty">
            <CalendarX class="empty-icon" />
            <p>No active events right now.</p>
          </div>

          <div class="roll-action" v-if="events.length > 0">
            <div class="cost-info">
              <Info class="info-icon"/> Cost per roll: <strong>10 Coins</strong>
            </div>
            <button class="pro-btn-primary full-width" @click="rollGacha" :disabled="rolling || user?.coins < 10 || !selectedEvent">
              <span v-if="!rolling">Roll Now</span>
              <span v-else class="loading-state"><Loader2 class="spin-icon" /> Rolling...</span>
            </button>
            <div class="pro-error" v-if="gachaError">{{ gachaError }}</div>
          </div>
        </div>
      </div>

      <!-- History Section -->
      <div class="pro-card history-card animate-fade-in" style="animation-delay: 0.2s">
        <div class="card-header">
          <History class="header-icon" />
          <h2>Recent Activity</h2>
        </div>
        <div class="card-body p-0">
          <div class="table-container">
            <table class="pro-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Item Won</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, index) in historyData.data" :key="log.id">
                  <td>
                    <div class="event-cell">
                      <Ticket class="cell-icon" />
                      {{ log.event?.name }}
                    </div>
                  </td>
                  <td><span class="pro-badge">{{ log.item?.name }}</span></td>
                  <td class="text-secondary">{{ new Date(log.created_at).toLocaleString() }}</td>
                </tr>
                <tr v-if="!historyData.data || historyData.data.length === 0">
                  <td colspan="3" class="pro-empty-row">No activity found.</td>
                </tr>
              </tbody>
            </table>
            <!-- History Pagination -->
            <div class="pagination-wrapper" v-if="historyData.last_page > 1">
              <button class="pro-btn-outline btn-sm" :disabled="historyData.current_page === 1" @click="fetchHistory(historyData.current_page - 1)">Prev</button>
              <span class="text-secondary text-sm">Page {{ historyData.current_page }} of {{ historyData.last_page }}</span>
              <button class="pro-btn-outline btn-sm" :disabled="historyData.current_page === historyData.last_page" @click="fetchHistory(historyData.current_page + 1)">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional Modal -->
    <div class="pro-modal-overlay" v-if="showResult">
      <div class="pro-modal animate-zoom-in">
        <div class="modal-close" @click="showResult = false">
          <X />
        </div>
        <div class="modal-icon-wrapper">
          <PackageOpen class="modal-icon text-primary" />
        </div>
        <h2 class="modal-title">Item Acquired</h2>
        <p class="modal-subtitle">You successfully rolled an item from <strong>{{ events.find(e => e.id === selectedEvent)?.name }}</strong>.</p>
        
        <div class="reward-box">
          <div class="reward-name">{{ gachaResult?.name }}</div>
        </div>

        <button class="pro-btn-primary full-width mt-4" @click="showResult = false">Continue</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Coins, Dices, CalendarX, Info, Loader2, History, Ticket, X, PackageOpen } from 'lucide-vue-next';

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'));
const events = ref([]);
const selectedEvent = ref(null);
const historyData = ref({ data: [], current_page: 1, last_page: 1 });

const rolling = ref(false);
const gachaError = ref('');
const showResult = ref(false);
const gachaResult = ref(null);

const API_URL = 'http://localhost:8000/api';

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const userRes = await axios.get(`${API_URL}/user`);
    user.value = userRes.data;
    localStorage.setItem('user', JSON.stringify(user.value));

    const eventsRes = await axios.get(`${API_URL}/events`).catch(() => ({ data: [] }));
    events.value = eventsRes.data;
    if (events.value.length > 0) {
      selectedEvent.value = events.value[0].id;
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchHistory = async (page = 1) => {
  try {
    const histRes = await axios.get(`${API_URL}/user/history?page=${page}`);
    historyData.value = histRes.data;
  } catch (err) {
    console.error(err);
  }
};

const rollGacha = async () => {
  if (user.value.coins < 10) {
    gachaError.value = "Not enough coins!";
    return;
  }
  
  rolling.value = true;
  gachaError.value = '';
  showResult.value = false;
  
  try {
    const res = await axios.post(`${API_URL}/gacha`, { event_id: selectedEvent.value });
    gachaResult.value = res.data.item;
    
    setTimeout(() => {
      rolling.value = false;
      showResult.value = true;
      fetchData();
      fetchHistory(1);
    }, 1000);
    
  } catch (err) {
    rolling.value = false;
    gachaError.value = err.response?.data?.error || 'Gacha failed';
  }
};

onMounted(() => {
  fetchData();
  fetchHistory();
});
</script>

<style scoped>
.pro-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  width: 100%;
}

.pro-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.user-greeting h1 {
  font-size: 1.8rem;
  margin-bottom: 0.2rem;
}

.user-greeting p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.balance-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.balance-info {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  font-weight: 600;
}

.balance-value {
  font-size: 1.5rem;
  font-weight: 700;
}
.currency {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.balance-icon {
  width: 32px;
  height: 32px;
  color: var(--text-secondary);
}

.pro-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .pro-grid { grid-template-columns: 1fr; }
}

.pro-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

.card-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}
.card-body.p-0 {
  padding: 0;
}

.select-wrapper {
  position: relative;
}

.cost-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.info-icon {
  width: 16px;
  height: 16px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.spin-icon {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

.pro-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}
.empty-icon {
  width: 32px;
  height: 32px;
  opacity: 0.5;
}

.pro-error {
  margin-top: 1rem;
  color: var(--danger-color);
  font-size: 0.85rem;
  text-align: center;
}

.table-container {
  overflow-x: auto;
}

.pro-table {
  width: 100%;
  border-collapse: collapse;
}

.pro-table th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
}

.pro-table td {
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border-color);
}

.pro-table tr:last-child td {
  border-bottom: none;
}

.event-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cell-icon {
  width: 14px;
  height: 14px;
  color: var(--text-secondary);
}

.pro-empty-row {
  text-align: center;
  padding: 3rem !important;
  color: var(--text-secondary);
}

/* Modal */
.pro-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pro-modal {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
  box-shadow: var(--shadow-lg);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s;
}
.modal-close:hover {
  color: var(--text-primary);
}

.modal-icon-wrapper {
  width: 48px;
  height: 48px;
  margin: 0 auto 1.5rem;
  background-color: #e0e7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-icon {
  width: 24px;
  height: 24px;
}

.modal-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.reward-box {
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.reward-name {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
}
.text-sm { font-size: 0.85rem; }
</style>
