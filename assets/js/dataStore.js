// ═══════════════════════════════════════════
//   DATA STORE MODULE
//   Manages portfolio data via localStorage
//   with JSON fallback
// ═══════════════════════════════════════════

const DataStore = (() => {
  const STORAGE_KEY = 'jelly_portfolio_data';

  async function fetchInitialData() {
    try {
      // Determine the correct path based on current location
      const currentPath = window.location.pathname;
      const basePath = currentPath.includes('/pages/') || currentPath.includes('/admin/') 
        ? '../data/portfolio.json' 
        : './data/portfolio.json';
      
      const res = await fetch(basePath);
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (err) {
      console.warn('Failed to load portfolio data:', err);
      // Inline fallback minimal data
      return { projects: [], experience: [], skills: {}, blogs: [], profile: {}, stats: {} };
    }
  }

  async function getData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { 
        const data = JSON.parse(stored);
        updateStats(data);
        return data;
      } catch { /* fall through */ }
    }
    const data = await fetchInitialData();
    updateStats(data);
    saveData(data);
    return data;
  }

  function updateStats(data) {
    // Dynamically calculate stats based on actual data
    const totalSkills = Object.values(data.skills || {}).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
    data.stats = {
      projects: (data.projects || []).length,
      experience: (data.experience || []).length,
      technologies: totalSkills,
      blogs: (data.blogs || []).length
    };
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async function getSection(section) {
    const data = await getData();
    return data[section] || null;
  }

  async function addItem(section, item) {
    const data = await getData();
    if (!Array.isArray(data[section])) return false;
    item.id = section[0] + Date.now();
    data[section].push(item);
    saveData(data);
    return item;
  }

  async function updateItem(section, id, updates) {
    const data = await getData();
    if (!Array.isArray(data[section])) return false;
    const idx = data[section].findIndex(i => i.id === id);
    if (idx === -1) return false;
    data[section][idx] = { ...data[section][idx], ...updates };
    saveData(data);
    return data[section][idx];
  }

  async function deleteItem(section, id) {
    const data = await getData();
    if (!Array.isArray(data[section])) return false;
    data[section] = data[section].filter(i => i.id !== id);
    saveData(data);
    return true;
  }

  async function updateProfile(updates) {
    const data = await getData();
    data.profile = { ...data.profile, ...updates };
    saveData(data);
    return data.profile;
  }

  async function updateSkills(skillsData) {
    const data = await getData();
    data.skills = { ...data.skills, ...skillsData };
    saveData(data);
    return data.skills;
  }

  async function resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    return await fetchInitialData();
  }

  return { getData, saveData, getSection, addItem, updateItem, deleteItem, updateProfile, updateSkills, resetToDefault };
})();

export default DataStore;
