// Theme + UV light toggles (site-wide)
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // ---- Theme ----
  const savedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', savedTheme);

  const themeBtn = document.getElementById('toggleTheme');
  if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = root.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      syncUVAvailability();
    });
  }

  // ---- UV ----
  let uvEnabled = (localStorage.getItem('uv') === 'on');
  const uvBtn = document.getElementById('toggleUV');

  // add a small on-screen spotlight
  let spot = document.getElementById('uvSpot');
  if (!spot) {
    spot = document.createElement('div');
    spot.id = 'uvSpot';
    document.body.appendChild(spot);
  }

  const uvTargets = Array.from(document.querySelectorAll('[data-uv], .uv-hidden'));

  function setUV(on) {
    uvEnabled = on;
    localStorage.setItem('uv', on ? 'on' : 'off');
    root.classList.toggle('uv-on', on);
    if (uvBtn) uvBtn.textContent = on ? 'UV Light: On' : 'UV Light';
    syncUVAvailability();
  }

  function syncUVAvailability() {
    const isDark = (root.getAttribute('data-theme') === 'dark');
    const active = uvEnabled && isDark;

    root.classList.toggle('uv-active', active);

    // If user toggles to light mode, UV becomes unavailable but we keep preference stored
    if (uvBtn) {
      uvBtn.setAttribute('aria-disabled', isDark ? 'false' : 'true');
      uvBtn.classList.toggle('is-disabled', !isDark);
    }

    // hide any revealed notes when inactive
    if (!active) {
      uvTargets.forEach(el => el.classList.remove('uv-visible'));
    }
  }

  if (uvBtn) {
    uvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isDark = (root.getAttribute('data-theme') === 'dark');
      if (!isDark) return; // UV only works in dark mode
      setUV(!uvEnabled);
    });
  }

  // spotlight + reveal logic
  document.addEventListener('mousemove', (e) => {
    const active = root.classList.contains('uv-active');
    if (!active) return;

    // position spotlight
    spot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

    const R = 140; // reveal radius px
    uvTargets.forEach(el => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = cx - e.clientX;
      const dy = cy - e.clientY;
      const near = (dx*dx + dy*dy) <= (R*R);
      el.classList.toggle('uv-visible', near);
    });
  });

  // init
  if (uvEnabled) setUV(true);
  else syncUVAvailability();
});
