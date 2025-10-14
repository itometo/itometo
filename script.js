// ================= MOBILE MENU TOGGLE (Accessible) =================
// Declare shared variables so other functions (applyTheme) can reference them
let nav = null;
let headerEl = null;
let darkModeBtn = null;
let menuBtn = null;
let backdrop = null;

// Guard flags to avoid binding listeners multiple times
if (!window.__menuInit) window.__menuInit = { boundResize: false, initialized: false };

function isMobile() { return window.innerWidth <= 768; }

function createBackdrop() {
  if (backdrop) return backdrop;
  backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }
  // ensure single listener
  if (!backdrop.__bound) {
    backdrop.addEventListener('click', () => { hideMenu(); });
    backdrop.__bound = true;
  }
  return backdrop;
}

function showBackdrop() { createBackdrop(); backdrop.classList.add('visible'); }
function hideBackdrop() { if (backdrop) backdrop.classList.remove('visible'); }

function showMenu() {
  if (!nav || !menuBtn) return;
  nav.classList.add('menu-open');
  nav.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.classList.add('open');
  showBackdrop();
  const first = nav.querySelector('a');
  if (first) first.focus();
}

function hideMenu() {
  if (!nav || !menuBtn) return;
  nav.classList.remove('menu-open');
  nav.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.classList.remove('open');
  hideBackdrop();
  menuBtn.focus();
}

function handleResize() {
  if (!menuBtn || !nav) return;
  if (isMobile()) {
    menuBtn.style.display = 'inline-block';
    // close menu on resize down
    if (!nav.classList.contains('menu-open')) hideMenu();
  } else {
    menuBtn.style.display = 'none';
    // ensure nav is visible on desktop
    nav.style.display = 'flex';
    nav.classList.remove('menu-open');
    nav.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
}

function bindMenuEvents() {
  if (!menuBtn) return;
  if (!window.__menuInit.boundResize) {
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);
    window.__menuInit.boundResize = true;
  }

  // Avoid duplicate click listener
  if (!menuBtn.__menuBound) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      if (expanded) hideMenu(); else showMenu();
    });
    menuBtn.__menuBound = true;
  }

  // Close menu when clicking outside
  if (!document.__menuOutsideBound) {
    document.addEventListener('click', (e) => {
      if (!isMobile()) return;
      if (!nav || !menuBtn) return;
      const target = e.target;
      if (nav.contains(target) || menuBtn.contains(target)) return; // inside
      if (nav.classList.contains('menu-open')) hideMenu();
    });
    document.__menuOutsideBound = true;
  }

  // Close on Escape key
  if (!document.__menuEscBound) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav && nav.classList.contains('menu-open')) {
        hideMenu();
      }
    });
    document.__menuEscBound = true;
  }
}

function initMenu() {
  // If we've already initialized the menu, just re-run resize to adjust display
  headerEl = document.querySelector('header');
  nav = document.querySelector('header nav');
  darkModeBtn = document.getElementById('dark-mode');
  menuBtn = document.getElementById('menu-btn');

  // Fallback: create menu button if partial didn't include it
  if (!menuBtn && headerEl) {
    menuBtn = document.createElement('button');
    menuBtn.id = 'menu-btn';
    menuBtn.setAttribute('aria-controls', 'main-nav');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Toggle main menu');
    menuBtn.innerText = 'MENU';
    headerEl.appendChild(menuBtn);
  }

  if (nav) {
    nav.setAttribute('id', nav.getAttribute('id') || 'main-nav');
    if (!nav.hasAttribute('aria-hidden')) nav.setAttribute('aria-hidden', 'true');
  }

  bindMenuEvents();
  // run a resize to set correct initial state
  handleResize();
  window.__menuInit.initialized = true;
}

// Initialize on DOM ready and after partials replacement
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMenu);
else initMenu();

window.addEventListener('partials:loaded', () => {
  // Re-init menu after partials included
  initMenu();
});


// ================= BACK TO TOP BUTTON =================
const backToTop = document.createElement("button");
backToTop.innerText = "▲ DATA TOP"; // Sci-Fi label
backToTop.id = "back-to-top";
backToTop.style.position = "fixed";
backToTop.style.bottom = "20px";
backToTop.style.right = "20px";
backToTop.style.padding = "10px 15px";
backToTop.style.fontSize = "0.9rem";
// Sci-Fi Styling
backToTop.style.background = "var(--bg-color)"; // Themed background
backToTop.style.color = "var(--accent-color)"; // Themed text
backToTop.style.border = "1px solid var(--accent-color)";
backToTop.style.borderRadius = "0"; // Sharp corners
backToTop.style.cursor = "pointer";
backToTop.style.display = "none";
backToTop.style.boxShadow = "0 0 10px rgba(103, 255, 155, 0.5)"; // Glow
backToTop.style.fontFamily = "'Inconsolata', 'Courier New', monospace";
backToTop.style.letterSpacing = "0.05em";

document.body.appendChild(backToTop);

// Show button when scrolling down
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

// Scroll to top on click
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// ================= DARK/LIGHT MODE TOGGLE =================
function bindThemeToggle() {
  const btn = document.getElementById("dark-mode");
  if (!btn) {
    console.log("Dark mode button not found, will retry after partials load");
    return;
  }
  
  // Avoid binding multiple times
  if (btn.hasAttribute('data-theme-bound')) {
    console.log("Theme toggle already bound");
    return;
  }
  btn.setAttribute('data-theme-bound', 'true');
  
  console.log("Binding theme toggle to button");
  
  // Click handler
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Theme toggle clicked");
    const isDark = document.body.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    console.log(`Switching theme from ${isDark ? 'dark' : 'light'} to ${next}`);
    applyTheme(next);
  });
  
  // Keyboard shortcut: Ctrl/Cmd + Shift + D
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      const isDark = document.body.classList.contains("dark");
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      
      // Visual feedback
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    }
  });
}

function applyTheme(theme) {
  console.log(`Applying theme: ${theme}`);
  
  // Add animation class
  document.body.classList.add('theme-changing');
  
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  
  console.log(`Body classes after theme change: ${document.body.className}`);
  
  const darkModeBtn = document.getElementById("dark-mode");
  if (darkModeBtn) {
    // Better button text with icons
    if (theme === "dark") {
      darkModeBtn.innerHTML = "☀️ Light";
      darkModeBtn.setAttribute("title", "Switch to light mode");
    } else {
      darkModeBtn.innerHTML = "🌙 Dark";
      darkModeBtn.setAttribute("title", "Switch to dark mode");
    }
    darkModeBtn.setAttribute("aria-pressed", theme === "dark" ? "false" : "true");
    console.log(`Updated button text to: ${darkModeBtn.innerHTML}`);
  } else {
    console.log("Dark mode button not found when trying to update it");
  }
  // Update dynamic inline-styled elements to reflect CSS vars
  try {
    const cs = getComputedStyle(document.body);
    const accent = cs.getPropertyValue('--accent-color').trim();
    const bg = cs.getPropertyValue('--bg-color').trim();
    if (menuBtn) {
      menuBtn.style.color = accent;
      menuBtn.style.borderColor = cs.getPropertyValue('--secondary-color').trim() || accent;
    }
    backToTop.style.color = accent;
    backToTop.style.borderColor = accent;
    backToTop.style.background = bg;
  } catch (e) {}
  
  // Smooth transition effect
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  setTimeout(() => {
    document.body.style.transition = '';
    document.body.classList.remove('theme-changing');
  }, 300);
  
  // Store theme preference
  try { 
    localStorage.setItem("theme", theme); 
    console.log(`Theme switched to: ${theme}`);
  } catch (e) {}
}

function initTheme() {
  let theme = "dark"; // Always default to dark mode
  try {
    const saved = localStorage.getItem("theme");
    if (saved) {
      theme = saved; // Use saved preference if exists
    } else {
      // Always default to dark mode, completely ignore system preferences
      theme = "dark";
    }
  } catch (e) {
    theme = "dark"; // Fallback to dark mode on any error
  }
  applyTheme(theme);
}

// Initialize theme and try to bind toggle
initTheme();

// Try to bind immediately if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, trying to bind theme toggle");
    bindThemeToggle();
  });
} else {
  console.log("DOM already ready, trying to bind theme toggle");
  bindThemeToggle();
}

// Re-bind after partials load (this is when nav.html loads)
window.addEventListener('partials:loaded', () => {
  console.log("Partials loaded, re-binding theme toggle");
  // Re-bind after nav include
  bindThemeToggle();
  // Also refresh button label to current theme
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? 'dark' : 'light');
});

// Additional fallback: check for button periodically until found
let retryCount = 0;
const maxRetries = 10;
function retryBindTheme() {
  const btn = document.getElementById("dark-mode");
  if (btn && !btn.hasAttribute('data-theme-bound')) {
    console.log("Found theme button on retry, binding now");
    bindThemeToggle();
    return;
  }
  
  retryCount++;
  if (retryCount < maxRetries) {
    setTimeout(retryBindTheme, 500);
  } else {
    console.log("Max retries reached for theme button binding");
  }
}

// Start retry process
setTimeout(retryBindTheme, 100);

// Delegated click handler as a robust fallback
document.addEventListener('click', (ev) => {
  const btn = ev.target && ev.target.closest && ev.target.closest('#dark-mode');
  if (!btn) return;
  
  console.log("Delegated click handler triggered for theme toggle");
  
  // Prevent duplicate handling if the main event listener is working
  if (btn.hasAttribute('data-theme-bound')) {
    console.log("Main handler should handle this, skipping delegated handler");
    return;
  }
  
  console.log("Using delegated handler for theme toggle");
  const isDark = document.body.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
});
