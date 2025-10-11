/**
 * Very small client-side include system.
 * Usage:
 *   <script data-include="partials/head.html" data-base="./"></script>
 * Replaces the script tag with the fetched partial. Supports {BASE} in partials.
 */
(function(){
  async function includeOne(tag) {
    const src = tag.getAttribute('data-include');
    const base = tag.getAttribute('data-base') || './';
    if (!src) return;
    try {
      const res = await fetch(src, { cache: 'no-cache' });
      const html = (await res.text()).replaceAll('{BASE}', base);
      const frag = document.createElement('div');
      frag.innerHTML = html;
      const nodes = Array.from(frag.childNodes);
      tag.replaceWith(...nodes);
    } catch (e) {
      console.error('Include failed:', src, e);
      // Fallback for file:// or fetch-restricted contexts
      let fallback = '';
      if (src.endsWith('nav.html')) {
        fallback = (
          '  <header>'+
          '    <div class="logo">'+
          '      <img src="'+base+'icon.png" alt="Itometo alien icon" class="logo-mark"/>'+
          '      <span>itoMeto</span>'+
          '    </div>'+
          '    <nav>'+
          '      <a href="'+base+'index.html#home">Home</a>'+
          '      <a href="'+base+'index.html#logs">Logs</a>'+
          '      <a href="'+base+'index.html#guide">Field Guide</a>'+
          '      <a href="'+base+'index.html#about">Origin</a>'+
          '      <a href="'+base+'index.html#contact">Contact</a>'+
          '    </nav>'+
          '    <button id="dark-mode" aria-label="Toggle color theme" aria-pressed="false">Light Mode</button>'+
          '  </header>'
        );
      } else if (src.endsWith('head.html')) {
        fallback = (
          '  <meta charset="UTF-8">'+
          '  <meta name="viewport" content="width=device-width, initial-scale=1.0">'+
          '  <link rel="icon" href="'+base+'icon.png" type="image/png">'+
          '  <link rel="stylesheet" href="'+base+'style.css">'
        );
      }
      if (fallback) {
        const frag = document.createElement('div');
        frag.innerHTML = fallback;
        const nodes = Array.from(frag.childNodes);
        tag.replaceWith(...nodes);
      }
    }
  }
  async function run() {
    const tags = document.querySelectorAll('script[data-include]');
    for (const t of tags) { await includeOne(t); }
    try {
      window.dispatchEvent(new CustomEvent('partials:loaded'));
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
