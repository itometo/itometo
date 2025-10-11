// ================= MOBILE MENU TOGGLE =================
const nav = document.querySelector("header nav");
const menuBtn = document.createElement("button");

// Sci-Fi Styling for Menu Button
menuBtn.innerText = ":: MENU ::"; // Sci-Fi label
menuBtn.id = "menu-btn";
menuBtn.style.fontSize = "1rem";
menuBtn.style.background = "none";
menuBtn.style.border = "1px solid var(--secondary-color)"; // Border uses theme var
menuBtn.style.padding = "5px 10px";
menuBtn.style.cursor = "pointer";
menuBtn.style.display = "none";
menuBtn.style.color = "var(--accent-color)"; // Accent text
menuBtn.style.fontFamily = "'Inconsolata', 'Courier New', monospace";
menuBtn.style.letterSpacing = "0.1em";

// Append the button to header
document.querySelector("header").appendChild(menuBtn);

// Show/hide menu on small screens
function handleResize() {
  // Using 768px to align with the CSS media query
  if (window.innerWidth <= 768) { 
    menuBtn.style.display = "block";
    // Keep nav hidden initially on mobile
    if (nav.classList.contains('menu-open')) {
        nav.style.display = "flex"; // If menu was open, keep it open on resize
    } else {
        nav.style.display = "none";
    }
  } else {
    menuBtn.style.display = "none";
    nav.style.display = "flex";
    nav.style.flexDirection = "row";
    nav.style.gap = "2rem"; // Match CSS gap
    nav.classList.remove('menu-open'); // Ensure class is removed on desktop
  }
}
window.addEventListener("resize", handleResize);
window.addEventListener("load", handleResize);

// Toggle nav on click
menuBtn.addEventListener("click", () => {
  if (nav.style.display === "none") {
    nav.style.display = "flex";
    nav.style.flexDirection = "column";
    nav.style.gap = "1rem";
    nav.classList.add('menu-open');
  } else {
    nav.style.display = "none";
    nav.classList.remove('menu-open');
  }
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
  if (!btn) return;
  btn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}

function applyTheme(theme) {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  const darkModeBtn = document.getElementById("dark-mode");
  if (darkModeBtn) {
    darkModeBtn.innerText = theme === "dark" ? "Light Mode" : "Dark Mode";
    darkModeBtn.setAttribute("aria-pressed", theme === "dark" ? "false" : "true");
  }
  // Update dynamic inline-styled elements to reflect CSS vars
  try {
    const cs = getComputedStyle(document.body);
    const accent = cs.getPropertyValue('--accent-color').trim();
    const bg = cs.getPropertyValue('--bg-color').trim();
    menuBtn.style.color = accent;
    menuBtn.style.borderColor = cs.getPropertyValue('--secondary-color').trim() || accent;
    backToTop.style.color = accent;
    backToTop.style.borderColor = accent;
    backToTop.style.background = bg;
  } catch (e) {}
  // DEBUG: Show theme in footer
  try {
    let indicator = document.getElementById('theme-indicator');
    if (!indicator) {
      indicator = document.createElement('span');
      indicator.id = 'theme-indicator';
      indicator.style.marginLeft = '1em';
      indicator.style.fontWeight = 'bold';
      indicator.style.fontSize = '1em';
      indicator.style.color = 'var(--accent-color)';
      const footer = document.querySelector('footer');
      if (footer) footer.appendChild(indicator);
    }
    indicator.textContent = `[Theme: ${theme}]`;
  } catch (e) {}
  // DEBUG: Log to console
  console.log('[Theme]', theme, 'body.classList:', document.body.classList.value);
}

function initTheme() {
  let theme = "dark";
  try {
    const saved = localStorage.getItem("theme");
    if (saved) theme = saved;
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) theme = "dark";
    else theme = "light";
  } catch (e) {}
  applyTheme(theme);
}

initTheme();
bindThemeToggle();
window.addEventListener('partials:loaded', () => {
  // Re-bind after nav include
  bindThemeToggle();
  // Also refresh button label to current theme
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? 'dark' : 'light');
});

// Delegated click handler as a robust fallback
document.addEventListener('click', (ev) => {
  const btn = ev.target && ev.target.closest && ev.target.closest('#dark-mode');
  if (!btn) return;
  const isDark = document.body.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});
