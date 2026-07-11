<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Admin Console</h2>
        <button class="mobile-menu-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <Menu class="icon" v-if="!isMobileMenuOpen" />
          <X class="icon" v-else />
        </button>
      </div>
      <ul class="nav-list" :class="{ 'mobile-hidden': !isMobileMenuOpen }">
        <li :class="{ active: currentTab === 'dashboard' }" @click="currentTab = 'dashboard'; isMobileMenuOpen = false">
          <LayoutDashboard class="icon" /> Dashboard
        </li>
        <li :class="{ active: currentTab === 'users' }" @click="currentTab = 'users'; isMobileMenuOpen = false">
          <Users class="icon" /> Users
        </li>
        <li :class="{ active: currentTab === 'events' }" @click="currentTab = 'events'; isMobileMenuOpen = false">
          <Ticket class="icon" /> Events & Items
        </li>
        <li :class="{ active: currentTab === 'history' }" @click="currentTab = 'history'; isMobileMenuOpen = false">
          <History class="icon" /> Global History
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="admin-main">
      <div class="topbar">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <button class="pro-btn-outline" @click="$router.push('/dashboard')">
          <ArrowLeft class="icon-sm" style="margin-right:0.5rem" /> Back to App
        </button>
      </div>

      <div class="content-wrapper">
        
        <!-- DASHBOARD TAB -->
        <div v-if="currentTab === 'dashboard'" class="animate-fade-in">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-header">
                <h3>Total Users</h3>
                <Users class="stat-icon" />
              </div>
              <div class="stat-value">{{ stats.totalUsers || 0 }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-header">
                <h3>Total Events</h3>
                <Calendar class="stat-icon" />
              </div>
              <div class="stat-value">{{ stats.totalEvents || 0 }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-header">
                <h3>Total Gacha Rolls</h3>
                <Dices class="stat-icon" />
              </div>
              <div class="stat-value">{{ stats.totalGacha || 0 }}</div>
            </div>
          </div>
          
          <div class="pro-card mt-4 p-4">
            <h3 class="mb-4 text-secondary">Gacha Activity (Last 7 Days)</h3>
            <div class="chart-wrapper">
              <Bar v-if="chartData.labels" :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <!-- USERS TAB -->
        <div v-if="currentTab === 'users'" class="animate-fade-in">
          <div class="pro-card">
            <table class="pro-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Coins</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(u, index) in usersData.data" :key="u.id">
                  <td class="text-secondary">{{ (usersData.current_page - 1) * usersData.per_page + index + 1 }}</td>
                  <td v-if="editingUser === u.id"><input class="form-control" v-model="editData.name" style="padding:0.3rem" /></td>
                  <td v-else>{{ u.name }}</td>
                  <td class="text-secondary">{{ u.email }}</td>
                  <td v-if="editingUser === u.id"><input type="number" class="form-control" v-model="editData.coins" style="padding:0.3rem; width: 80px;" /></td>
                  <td v-else><b>{{ u.coins }}</b></td>
                  <td v-if="editingUser === u.id">
                    <select v-model="editData.is_admin" class="form-control" style="padding:0.3rem">
                      <option :value="true">Admin</option>
                      <option :value="false">User</option>
                    </select>
                  </td>
                  <td v-else>
                    <span class="pro-badge">{{ u.is_admin ? 'Admin' : 'User' }}</span>
                  </td>
                  <td>
                    <div v-if="editingUser === u.id" style="display:flex; gap:0.5rem">
                      <button class="action-btn text-primary" @click="saveUser(u.id)"><Check class="action-icon"/></button>
                      <button class="action-btn text-secondary" @click="editingUser = null"><X class="action-icon"/></button>
                    </div>
                    <div v-else style="display:flex; gap:0.5rem">
                      <button class="action-btn text-primary" @click="startEditUser(u)"><Edit2 class="action-icon"/></button>
                      <button class="action-btn text-danger" @click="deleteUser(u.id)"><Trash2 class="action-icon"/></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Users Pagination -->
            <div class="pagination-wrapper" v-if="usersData.last_page > 1">
              <button class="pro-btn-outline btn-sm" :disabled="usersData.current_page === 1" @click="fetchUsers(usersData.current_page - 1)">Prev</button>
              <span class="text-secondary text-sm">Page {{ usersData.current_page }} of {{ usersData.last_page }}</span>
              <button class="pro-btn-outline btn-sm" :disabled="usersData.current_page === usersData.last_page" @click="fetchUsers(usersData.current_page + 1)">Next</button>
            </div>
          </div>
        </div>

        <!-- EVENTS TAB -->
        <div v-if="currentTab === 'events'" class="animate-fade-in">
          <div class="admin-grid">
            <div class="pro-card p-4">
              <h3 class="mb-4">Events</h3>
              <form @submit.prevent="createEvent" class="add-form">
                <input type="text" class="form-control" v-model="newEventName" placeholder="New Event Name" required />
                <button type="submit" class="pro-btn-primary">Add</button>
              </form>

              <div class="events-list mt-4">
                <div class="event-item" v-for="event in events" :key="event.id" @click="selectEvent(event)" :class="{ active: selectedEvent?.id === event.id }">
                  <div class="event-info">
                    <input v-if="editingEvent === event.id" type="text" class="form-control" v-model="editEventData.name" style="padding:0.2rem; width: 130px" @click.stop />
                    <span v-else class="event-name">{{ event.name }}</span>
                    <span :class="['pro-badge', 'status-badge', event.is_active ? 'badge-active' : 'badge-inactive']" @click.stop="toggleEventStatus(event)" title="Click to toggle status">
                      {{ event.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <div class="event-actions">
                    <template v-if="editingEvent === event.id">
                      <button class="action-btn text-primary" @click.stop="saveEvent(event.id)"><Check class="action-icon"/></button>
                      <button class="action-btn text-secondary" @click.stop="editingEvent = null"><X class="action-icon"/></button>
                    </template>
                    <template v-else>
                      <button class="action-btn text-primary hover-show-btn" @click.stop="startEditEvent(event)" title="Edit Event"><Edit2 class="action-icon"/></button>
                      <button class="action-btn text-danger hover-show-btn" @click.stop="deleteEvent(event.id)" title="Delete Event"><Trash2 class="action-icon"/></button>
                      <ChevronRight class="chevron-icon text-primary" v-if="selectedEvent?.id === event.id" />
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <div class="pro-card p-4">
              <div class="items-header">
                <h3 class="mb-0">Items for {{ selectedEvent ? selectedEvent.name : '...' }}</h3>
                <div v-if="selectedEvent" :class="['drop-rate-badge', totalDropRate === 100 ? 'badge-success' : 'badge-warning']">
                  Total Rate: {{ totalDropRate }}%
                  <AlertTriangle v-if="totalDropRate !== 100" class="icon-sm ml-1" />
                  <CheckCircle2 v-else class="icon-sm ml-1" />
                </div>
              </div>
              <div v-if="selectedEvent" class="mt-4">
                <form @submit.prevent="createItem" class="add-form">
                  <input type="text" class="form-control" v-model="newItem.name" placeholder="Item Name" required />
                  <input type="number" step="0.01" class="form-control" v-model="newItem.drop_rate" placeholder="Rate (%)" required />
                  <button type="submit" class="pro-btn-primary">Add</button>
                </form>

                <div class="table-container mt-4">
                  <table class="pro-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Rate</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in items" :key="item.id" :class="{ 'inactive-row': !item.is_active }">
                        <td v-if="editingItem === item.id"><input class="form-control" v-model="editItemData.name" style="padding:0.3rem" /></td>
                        <td v-else>{{ item.name }}</td>
                        
                        <td v-if="editingItem === item.id"><input type="number" step="0.01" class="form-control" v-model="editItemData.drop_rate" style="padding:0.3rem; width: 80px;" /></td>
                        <td v-else>{{ item.drop_rate }}%</td>

                        <td v-if="editingItem === item.id">
                          <select class="form-control" v-model="editItemData.is_active" style="padding:0.3rem">
                            <option :value="true">Active</option>
                            <option :value="false">Inactive</option>
                          </select>
                        </td>
                        <td v-else>
                          <span :class="['pro-badge', 'status-badge', item.is_active ? 'badge-active' : 'badge-inactive']" @click.stop="toggleItemStatus(item)" title="Click to toggle status">
                            {{ item.is_active ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                        
                        <td>
                          <div v-if="editingItem === item.id" style="display:flex; gap:0.5rem">
                            <button class="action-btn text-primary" @click="saveItem(item.id)"><Check class="action-icon"/></button>
                            <button class="action-btn text-secondary" @click="editingItem = null"><X class="action-icon"/></button>
                          </div>
                          <div v-else style="display:flex; gap:0.5rem">
                            <button class="action-btn text-primary" @click="startEditItem(item)"><Edit2 class="action-icon"/></button>
                            <button class="action-btn text-danger" @click="deleteItem(item.id)"><Trash2 class="action-icon"/></button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="items.length === 0">
                        <td colspan="4" class="text-center text-secondary py-4">No items found.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else class="empty-state text-secondary">
                Select an event to manage its items.
              </div>
            </div>
          </div>
        </div>

        <!-- HISTORY TAB -->
        <div v-if="currentTab === 'history'" class="animate-fade-in">
          <div class="pro-card">
            <table class="pro-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Event</th>
                  <th>Item Won</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in historiesData.data" :key="log.id">
                  <td>{{ log.user?.name }}</td>
                  <td>{{ log.event?.name }}</td>
                  <td><span class="pro-badge">{{ log.item?.name }}</span></td>
                  <td class="text-secondary">{{ new Date(log.created_at).toLocaleString() }}</td>
                </tr>
                <tr v-if="!historiesData.data || historiesData.data.length === 0">
                  <td colspan="4" class="text-center text-secondary py-4">No history found.</td>
                </tr>
              </tbody>
            </table>
            <!-- History Pagination -->
            <div class="pagination-wrapper" v-if="historiesData.last_page > 1">
              <button class="pro-btn-outline btn-sm" :disabled="historiesData.current_page === 1" @click="fetchHistories(historiesData.current_page - 1)">Prev</button>
              <span class="text-secondary text-sm">Page {{ historiesData.current_page }} of {{ historiesData.last_page }}</span>
              <button class="pro-btn-outline btn-sm" :disabled="historiesData.current_page === historiesData.last_page" @click="fetchHistories(historiesData.current_page + 1)">Next</button>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { LayoutDashboard, Users, Ticket, History, Calendar, Dices, ArrowLeft, Edit2, Trash2, Check, X, ChevronRight, AlertTriangle, CheckCircle2, Menu } from 'lucide-vue-next';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const API_URL = 'http://localhost:8000/api';

const currentTab = ref('dashboard');
const isMobileMenuOpen = ref(false);
const stats = ref({});
const chartData = ref({});
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleFont: { size: 13, family: 'Inter' },
      bodyFont: { size: 13, family: 'Inter' },
      padding: 10,
      cornerRadius: 6,
      displayColors: false
    }
  },
  scales: { 
    x: { 
      grid: { display: false },
      ticks: { color: '#64748b', font: { family: 'Inter' } }
    }, 
    y: { 
      grid: { color: '#e2e8f0', borderDash: [5, 5] },
      border: { display: false },
      ticks: { color: '#64748b', stepSize: 1, font: { family: 'Inter' } }
    }
  }
};

const usersData = ref({ data: [], current_page: 1, per_page: 10, last_page: 1 });
const events = ref([]);
const items = ref([]);
const historiesData = ref({ data: [], current_page: 1, last_page: 1 });
const selectedEvent = ref(null);

const newEventName = ref('');
const newItem = ref({ name: '', drop_rate: '' });

const editingUser = ref(null);
const editData = ref({ name: '', coins: 0, is_admin: false });

const editingEvent = ref(null);
const editEventData = ref({ name: '' });

const editingItem = ref(null);
const editItemData = ref({ name: '', drop_rate: 0, is_active: true });

const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Overview',
    users: 'Manage Users',
    events: 'Events & Items',
    history: 'Global History'
  };
  return titles[currentTab.value];
});

const totalDropRate = computed(() => {
  return items.value
    .filter(i => i.is_active)
    .reduce((sum, item) => sum + parseFloat(item.drop_rate), 0);
});

const fetchStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/stats`);
    stats.value = res.data;
    
    const rawData = res.data.historyChart || [];
    chartData.value = {
      labels: rawData.map(d => {
        // Format date to a readable form like "Jul 10"
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: ' Rolls',
          backgroundColor: 'rgba(79, 70, 229, 0.85)',
          hoverBackgroundColor: '#4f46e5',
          borderRadius: 6,
          barPercentage: 0.6,
          data: rawData.map(d => d.count)
        }
      ]
    };
  } catch(err) { console.error(err); }
};

const fetchUsers = async (page = 1) => {
  try {
    const res = await axios.get(`${API_URL}/admin/users?page=${page}`);
    usersData.value = res.data;
  } catch(err) { console.error(err); }
};

const startEditUser = (u) => {
  editingUser.value = u.id;
  editData.value = { name: u.name, coins: u.coins, is_admin: u.is_admin };
};

const saveUser = async (id) => {
  try {
    await axios.put(`${API_URL}/admin/users/${id}`, editData.value);
    editingUser.value = null;
    fetchUsers(usersData.value.current_page);
  } catch(err) { alert('Error updating user'); }
};

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    await axios.delete(`${API_URL}/admin/users/${id}`);
    fetchUsers(usersData.value.current_page);
  } catch(err) { alert(err.response?.data?.message || 'Error deleting user'); }
};

const fetchEvents = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/events`);
    events.value = res.data;
  } catch (err) { console.error(err); }
};

const fetchHistories = async (page = 1) => {
  try {
    const res = await axios.get(`${API_URL}/admin/history?page=${page}`);
    historiesData.value = res.data;
  } catch (err) { console.error(err); }
};

const selectEvent = async (event) => {
  if (selectedEvent.value?.id === event.id) {
    selectedEvent.value = null;
    items.value = [];
    return;
  }
  selectedEvent.value = event;
  try {
    const res = await axios.get(`${API_URL}/admin/events/${event.id}/items`);
    items.value = res.data;
  } catch (err) { console.error(err); }
};

const createEvent = async () => {
  if (!newEventName.value) return;
  try {
    await axios.post(`${API_URL}/admin/events`, { name: newEventName.value });
    newEventName.value = '';
    fetchEvents();
  } catch (err) { alert('Error creating event'); }
};

const toggleEventStatus = async (event) => {
  try {
    await axios.put(`${API_URL}/admin/events/${event.id}`, { name: event.name, is_active: !event.is_active });
    fetchEvents();
    if(selectedEvent.value?.id === event.id) selectedEvent.value.is_active = !event.is_active;
  } catch (err) { alert('Error updating event'); }
};

const startEditEvent = (event) => {
  editingEvent.value = event.id;
  editEventData.value = { name: event.name };
};

const saveEvent = async (id) => {
  try {
    const event = events.value.find(e => e.id === id);
    await axios.put(`${API_URL}/admin/events/${id}`, { name: editEventData.value.name, is_active: event.is_active });
    editingEvent.value = null;
    fetchEvents();
    if(selectedEvent.value?.id === id) selectedEvent.value.name = editEventData.value.name;
  } catch(err) { alert('Error updating event'); }
};

const deleteEvent = async (id) => {
  if (!confirm('Are you sure you want to delete this event? This will also delete all its items.')) return;
  try {
    await axios.delete(`${API_URL}/admin/events/${id}`);
    if(selectedEvent.value?.id === id) { selectedEvent.value = null; items.value = []; }
    fetchEvents();
  } catch (err) { alert('Error deleting event'); }
};

const createItem = async () => {
  if (!selectedEvent.value) return;
  try {
    await axios.post(`${API_URL}/admin/events/${selectedEvent.value.id}/items`, newItem.value);
    newItem.value = { name: '', drop_rate: '' };
    selectEvent(selectedEvent.value);
  } catch (err) { alert('Error creating item'); }
};

const deleteItem = async (id) => {
  if (!confirm('Are you sure?')) return;
  try {
    await axios.delete(`${API_URL}/admin/items/${id}`);
    selectEvent(selectedEvent.value);
  } catch (err) { console.error(err); }
};

const startEditItem = (item) => {
  editingItem.value = item.id;
  editItemData.value = { name: item.name, drop_rate: item.drop_rate, is_active: item.is_active };
};

const saveItem = async (id) => {
  try {
    await axios.put(`${API_URL}/admin/items/${id}`, editItemData.value);
    editingItem.value = null;
    selectEvent(selectedEvent.value);
  } catch(err) { alert('Error updating item'); }
};

const toggleItemStatus = async (item) => {
  try {
    await axios.put(`${API_URL}/admin/items/${item.id}`, { name: item.name, drop_rate: item.drop_rate, is_active: !item.is_active });
    item.is_active = !item.is_active;
  } catch (err) { alert('Error updating item status'); }
};

onMounted(() => {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  fetchStats();
  fetchUsers();
  fetchEvents();
  fetchHistories();
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 100;
  background-color: var(--bg-main);
}

.sidebar {
  width: 260px;
  background-color: var(--bg-card);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}
.sidebar-header h2 {
  font-size: 1.1rem;
  margin: 0;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
}

.nav-list {
  list-style: none;
  padding: 1rem;
}

.nav-list li {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.15s;
}

.nav-list li .icon {
  margin-right: 12px;
  width: 18px;
  height: 18px;
}

.nav-list li:hover {
  background-color: var(--border-color);
  color: var(--text-primary);
}

.nav-list li.active {
  background-color: #e0e7ff;
  color: var(--primary-color);
  font-weight: 600;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.topbar {
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 1.25rem;
}
.icon-sm { width: 16px; height: 16px; }

.content-wrapper {
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.stat-card {
  background-color: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}
.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.stat-header h3 {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}
.stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.pro-card {
  background-color: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}
.p-4 { padding: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }

.chart-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
}

.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.add-form {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
}
.action-btn:hover {
  background-color: var(--border-color);
}
.action-icon {
  width: 16px; height: 16px;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--bg-card);
}
.event-item:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
.event-item.active {
  border-color: var(--primary-color);
  background-color: #e0e7ff;
}

.event-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.event-name {
  font-weight: 600;
  color: var(--text-primary);
}

.event-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chevron-icon {
  width: 20px;
  height: 20px;
}
.ml-1 { margin-left: 0.25rem; }

.status-badge { cursor: pointer; transition: opacity 0.2s; }
.status-badge:hover { opacity: 0.8; }
.badge-active { background-color: #dcfce7; color: #166534; }
.badge-inactive { background-color: #f1f5f9; color: #475569; }

.inactive-row {
  opacity: 0.6;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.drop-rate-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 9999px;
}
.badge-success { background-color: #dcfce7; color: #16a34a; }
.badge-warning { background-color: #fef3c7; color: #d97706; }

.hover-show-btn {
  opacity: 0;
  transition: opacity 0.2s;
}
.event-item:hover .hover-show-btn {
  opacity: 1;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  border: 1px dashed var(--border-color);
  border-radius: 6px;
}

/* Base table inherited from style.css but tweaked */
.pro-table {
  width: 100%;
  border-collapse: collapse;
}
.pro-table th {
  text-align: left;
  padding: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}
.pro-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
}
.text-sm { font-size: 0.85rem; }

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  .sidebar-header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1rem 1rem 1rem;
    gap: 0.25rem;
    overflow-x: hidden;
  }

  .nav-list.mobile-hidden {
    display: none;
  }

  .nav-list li {
    margin-bottom: 0.25rem;
    white-space: normal;
    padding: 0.75rem 1rem;
  }

  .topbar {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .admin-grid {
    grid-template-columns: 1fr;
  }

  .pro-card {
    overflow-x: auto;
  }
  
  .add-form {
    flex-direction: column;
  }
  
  .event-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .event-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .items-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
