/* ===================================
   THEME MANAGEMENT
   =================================== */

const THEME_KEY = "orbit-ntp-theme";
const SETTINGS_KEY = "orbit-ntp-settings";

const THEMES = {
  crystal: "Crystal Sharp (Dark)",
  light: "Light Mode",
  nord: "Nord (Blue)",
  dracula: "Dracula (Purple)",
  monokai: "Monokai (Minimal)"
};

const DEFAULT_THEME = "crystal";
const DEFAULT_SETTINGS = {
  showShortcuts: true,
  showClock: true,
  enableAnimations: true
};

// Initialize theme on page load
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  applyTheme(savedTheme);
  updateThemeButtons(savedTheme);
}

// Apply theme to document
function applyTheme(themeName) {
  if (!THEMES[themeName]) return;
  
  document.documentElement.setAttribute("data-theme", themeName);
  localStorage.setItem(THEME_KEY, themeName);
  
  // Log theme change
  console.log(`[NTP] Theme changed to: ${themeName}`);
}

// Update theme buttons UI
function updateThemeButtons(activeName) {
  document.querySelectorAll(".theme-btn").forEach(btn => {
    if (btn.dataset.theme === activeName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Theme button listeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      updateThemeButtons(theme);
    });
  });
});

/* ===================================
   THEME TOGGLE BUTTON
   =================================== */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    const themeOrder = Object.keys(THEMES);
    const currentIndex = themeOrder.indexOf(current);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];
    
    applyTheme(nextTheme);
    updateThemeButtons(nextTheme);
  });
}

/* ===================================
   DEVELOPER MENU
   =================================== */

const devMenu = document.getElementById("devMenu");
const devModal = document.getElementById("devModal");
const devClose = document.getElementById("devClose");

if (devMenu && devModal) {
  devMenu.addEventListener("click", () => {
    devModal.classList.add("active");
    updateStorageInfo();
  });

  devClose.addEventListener("click", () => {
    devModal.classList.remove("active");
  });

  // Close on outside click
  devModal.addEventListener("click", (e) => {
    if (e.target === devModal) {
      devModal.classList.remove("active");
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && devModal.classList.contains("active")) {
      devModal.classList.remove("active");
    }
  });
}

/* ===================================
   DEVELOPER SETTINGS
   =================================== */

function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applySettings(settings);
}

function applySettings(settings) {
  if (!settings.showShortcuts) {
    document.querySelector(".quick-grid")?.style.display = "none";
  } else {
    document.querySelector(".quick-grid")?.style.display = "grid";
  }

  if (!settings.showClock) {
    document.querySelector(".mini-row:first-child")?.style.display = "none";
  } else {
    document.querySelector(".mini-row:first-child")?.style.display = "flex";
  }

  if (!settings.enableAnimations) {
    document.documentElement.style.setProperty("--transition-duration", "0ms");
  } else {
    document.documentElement.style.setProperty("--transition-duration", "0.2s");
  }
}

// Settings checkbox listeners
const showShortcuts = document.getElementById("showShortcuts");
const showClock = document.getElementById("showClock");
const enableAnimations = document.getElementById("enableAnimations");

if (showShortcuts) {
  showShortcuts.addEventListener("change", () => {
    const settings = loadSettings();
    settings.showShortcuts = showShortcuts.checked;
    saveSettings(settings);
  });
}

if (showClock) {
  showClock.addEventListener("change", () => {
    const settings = loadSettings();
    settings.showClock = showClock.checked;
    saveSettings(settings);
  });
}

if (enableAnimations) {
  enableAnimations.addEventListener("change", () => {
    const settings = loadSettings();
    settings.enableAnimations = enableAnimations.checked;
    saveSettings(settings);
  });
}

/* ===================================
   CLOCK UPDATE
   =================================== */

const timeElement = document.getElementById("time");

function updateClock() {
  if (!timeElement) return;
  
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  timeElement.textContent = `${hours}:${minutes}`;
}

// Update immediately and then every 30 seconds
updateClock();
setInterval(updateClock, 1000 * 30);

/* ===================================
   STORAGE INFO
   =================================== */

function updateStorageInfo() {
  const storageInfo = document.getElementById("storageInfo");
  const cacheInfo = document.getElementById("cacheInfo");

  if (storageInfo) {
    const itemCount = Object.keys(localStorage).length;
    storageInfo.textContent = `LocalStorage: ${itemCount} items`;
  }

  if (cacheInfo) {
    if (caches) {
      caches.keys().then(names => {
        cacheInfo.textContent = `Cache: ${names.length} cache(s)`;
      });
    } else {
      cacheInfo.textContent = "Cache: Not available";
    }
  }
}

/* ===================================
   DEVELOPER CONSOLE
   =================================== */

const openConsole = document.getElementById("openConsole");
const clearStorage = document.getElementById("clearStorage");

if (openConsole) {
  openConsole.addEventListener("click", () => {
    // Open Chrome DevTools console
    console.clear();
    console.log("%c[Orbit NTP] Developer Console", "color: #63e6ff; font-size: 16px; font-weight: bold;");
    console.log("%cTheme:", "color: #8b5cf6; font-weight: bold;", localStorage.getItem(THEME_KEY) || DEFAULT_THEME);
    console.log("%cSettings:", "color: #8b5cf6; font-weight: bold;", loadSettings());
    console.log("%cAvailable Themes:", "color: #63e6ff; font-weight: bold;", THEMES);
    console.log("%cStorage Items:", "color: #63e6ff; font-weight: bold;", Object.keys(localStorage).length);
    
    // In a real browser extension, this would open DevTools
    // For now, just log to console
    alert("Check your browser console (F12) for developer information!");
  });
}

if (clearStorage) {
  clearStorage.addEventListener("click", () => {
    if (confirm("Are you sure? This will reset all NTP settings and cache.")) {
      localStorage.clear();
      sessionStorage.clear();
      console.log("[NTP] Storage cleared");
      location.reload();
    }
  });
}

/* ===================================
   SHORTCUTS / QUICK LINKS
   =================================== */

document.querySelectorAll(".tile").forEach(tile => {
  tile.addEventListener("click", (e) => {
    const text = tile.textContent.trim();
    console.log(`[NTP] Shortcut clicked: ${text}`);
  });
});

/* ===================================
   SEARCH FUNCTIONALITY
   =================================== */

const searchInput = document.querySelector(".searchbox input");

if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        // Check if it's a URL
        if (query.includes(".") && !query.includes(" ")) {
          window.location.href = query.startsWith("http") ? query : `https://${query}`;
        } else {
          // Search using default search engine
          window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
      }
    }
  });
}

/* ===================================
   INITIALIZATION
   =================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  
  const settings = loadSettings();
  applySettings(settings);

  // Update checkboxes with saved settings
  if (showShortcuts) showShortcuts.checked = settings.showShortcuts;
  if (showClock) showClock.checked = settings.showClock;
  if (enableAnimations) enableAnimations.checked = settings.enableAnimations;

  console.log("[Orbit NTP] Initialized successfully");
  console.log("[Orbit NTP] Theme:", localStorage.getItem(THEME_KEY) || DEFAULT_THEME);
  console.log("[Orbit NTP] Settings:", settings);
});

/* ===================================
   ADVANCED FEATURES (FOR DEVELOPERS)
   =================================== */

// Global API for developer console access
window.OrbitNTP = {
  // Theme control
  setTheme: (themeName) => {
    if (THEMES[themeName]) {
      applyTheme(themeName);
      updateThemeButtons(themeName);
      console.log(`Theme set to: ${themeName}`);
    } else {
      console.error(`Unknown theme: ${themeName}. Available: ${Object.keys(THEMES).join(", ")}`);
    }
  },

  getTheme: () => localStorage.getItem(THEME_KEY) || DEFAULT_THEME,

  listThemes: () => THEMES,

  // Settings control
  setSetting: (key, value) => {
    const settings = loadSettings();
    if (key in DEFAULT_SETTINGS) {
      settings[key] = value;
      saveSettings(settings);
      console.log(`Setting ${key} = ${value}`);
    } else {
      console.error(`Unknown setting: ${key}`);
    }
  },

  getSettings: () => loadSettings(),

  resetSettings: () => {
    localStorage.removeItem(SETTINGS_KEY);
    applySettings(DEFAULT_SETTINGS);
    console.log("Settings reset to default");
  },

  // Storage management
  getStorageInfo: () => ({
    localStorageItems: Object.keys(localStorage).length,
    sessionStorageItems: Object.keys(sessionStorage).length,
    localStorageSize: new Blob(Object.values(localStorage)).size,
  }),

  clearAll: () => {
    if (confirm("Clear all storage?")) {
      localStorage.clear();
      sessionStorage.clear();
      console.log("All storage cleared");
      location.reload();
    }
  },

  // Info
  version: "1.0.0",
  debug: () => {
    console.log("%c[Orbit NTP Debug Info]", "color: #63e6ff; font-size: 14px; font-weight: bold;");
    console.table({
      "Theme": window.OrbitNTP.getTheme(),
      "Settings": JSON.stringify(window.OrbitNTP.getSettings()),
      "Storage": window.OrbitNTP.getStorageInfo(),
      "Version": window.OrbitNTP.version,
    });
  }
};

// Log API availability
console.log("%c[Orbit NTP] Developer API available: window.OrbitNTP", "color: #63e6ff; font-weight: bold;");
console.log("Example: OrbitNTP.setTheme('dracula'); OrbitNTP.debug();");
