// ================= MOBILE MENU TOGGLE =================
const nav = document.querySelector("header nav");
const menuBtn = document.createElement("button");

// Sci-Fi Styling for Menu Button
menuBtn.innerText = ":: MENU ::"; // Sci-Fi label
menuBtn.id = "menu-btn";
menuBtn.style.fontSize = "1rem";
menuBtn.style.background = "none";
menuBtn.style.border = "1px solid #00ff7f"; // Sci-Fi border
menuBtn.style.padding = "5px 10px";
menuBtn.style.cursor = "pointer";
menuBtn.style.display = "none";
menuBtn.style.color = "#00ff7f"; // Neon green text
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
backToTop.style.background = "#0d1117"; // Dark background
backToTop.style.color = "#00ff7f"; // Neon green text
backToTop.style.border = "1px solid #00ff7f";
backToTop.style.borderRadius = "0"; // Sharp corners
backToTop.style.cursor = "pointer";
backToTop.style.display = "none";
backToTop.style.boxShadow = "0 0 10px rgba(0, 255, 127, 0.5)"; // Glow
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
// Merged and simplified logic to match the 'Light Mode' button text in the simplified HTML
const darkModeBtn = document.getElementById("dark-mode");

// Function to set the button text based on the current body class
function updateDarkModeButtonText() {
    if (document.body.classList.contains("dark")) {
        darkModeBtn.innerText = "Light Mode";
    } else {
        darkModeBtn.innerText = "Dark Mode";
    }
}

// Initial check on page load
updateDarkModeButtonText();

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  updateDarkModeButtonText(); // Update text after toggling class
});