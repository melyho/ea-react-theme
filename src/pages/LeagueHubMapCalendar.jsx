/**
 * src/pages/LeagueHubMapCalendar.jsx
 *
 * Toggle + Map view copied directly from the validated ea-program-finder
 * WordPress plugin prototype (wordpress-plugin/ea-program-finder/includes/
 * template-finder.php + assets/js/ea-program-finder.js). The HTML markup and
 * the map/panel JS logic (ym3InitMap, ym3ApplyFiltersToMap, ym3PanelItemHtml,
 * ym3SelectProgramOnMap, near-me, favourites) are kept as close to the
 * original as possible and run as plain DOM code inside a single effect,
 * the same way they ran in the prototype - not rewritten as JSX.
 *
 * The only new code is the adapter at the top that maps the real badminton
 * feed's fields (Title, City, Day, Time, SessionDates, ...) onto the shape
 * the copied code expects (name, lat, lng, location, dates, days, time,
 * price, ...), since the prototype's mock data used different field names
 * and per-program coordinates that the real feed doesn't have.
 *
 * Calendar tab exists in the toggle only - not built yet.
 */
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

const CITY_COORDS = {
  aurora: [44.0065, -79.4504],
  newmarket: [44.0592, -79.4613],
  'richmond hill': [43.8828, -79.4403],
  georgina: [44.2496, -79.4665],
  keswick: [44.2501, -79.4665],
};

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (window.__eaLeafletLoading) return window.__eaLeafletLoading;
  window.__eaLeafletLoading = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS_URL;
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = LEAFLET_JS_URL;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.body.appendChild(script);
  });
  return window.__eaLeafletLoading;
}

/* ---- Adapter: real program row -> the shape the copied prototype code expects ---- */
function adaptProgram(p, index) {
  const norm = (v) => String(v || '').trim().toLowerCase();
  const coords = CITY_COORDS[norm(p.City)] || null;
  const isFull = p.is_full === true || String(p.is_full).toLowerCase() === 'true';
  const price = (() => {
    const raw = p.updated_price || p.StaticPriceText || p.TotalPrice;
    if (raw === undefined || raw === null || raw === '') return '';
    const num = Number(raw);
    if (!Number.isNaN(num)) return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
    return `$${String(raw).replace(/^\$/, '')}`;
  })();
  const sessionCount = String(p.SessionDates || '').split(',').map((s) => s.trim()).filter(Boolean).length;

  return {
    id: `bad-${index}-${p.Title || ''}`,
    name: p.Title || 'Badminton Program',
    ctaTags: [],
    lat: coords ? coords[0] : null,
    lng: coords ? coords[1] : null,
    sessions: sessionCount,
    ageRange: [p.MinAge, p.MaxAge].filter(Boolean).join(' - ') || '',
    dates: '',
    days: p.Day || '',
    time: p.Time || '',
    location: p.City || '',
    facility: p.LocationName || '',
    price: price || 'See website',
    priceNote: '',
    sport: 'Badminton',
    badge: isFull ? 'Full' : 'Registration Open',
    badgeKey: isFull ? 'full' : 'open',
    registerLink: p.RegisterLink || 'https://eabadminton.com/signup/',
    raw: p,
  };
}

export function ViewToggle({ view, setView, isMobile, showMap = true, showCalendar = true }) {
  const tabs = [
    { key: 'list', label: 'List', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> },
    ...(showMap ? [{ key: 'map', label: 'Map', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg> }] : []),
    ...(showCalendar ? [{ key: 'calendar', label: 'Calendar', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> }] : []),
  ];
  return (
    <div style={{ display: 'flex', background: 'var(--ea-mist, #F2F2F2)', borderRadius: 8, padding: 3, gap: 2, marginTop: isMobile ? 12 : 16, width: 'fit-content' }}>
      {tabs.map((tab) => (
        <button key={tab.key} type="button" onClick={() => setView(tab.key)} style={{
          padding: '6px 12px', borderRadius: 6, border: 'none', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 'var(--fw-semibold, 600)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s',
          background: view === tab.key ? '#fff' : 'transparent', color: view === tab.key ? 'var(--ea-teal-800, #005F79)' : 'var(--ea-slate, #47636B)',
          boxShadow: view === tab.key ? '0 1px 4px rgba(16,65,79,.10)' : 'none',
        }}>
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const CAL_MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function calDateKey(y, m, d) {
  return `${y}-${m}-${d}`;
}

function calStartOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function calBuildSessionMap(adaptedPrograms) {
  const map = {};
  adaptedPrograms.forEach((p) => {
    const dates = String((p.raw && p.raw.SessionDates) || '').split(',').map((s) => s.trim()).filter(Boolean);
    dates.forEach((dateStr) => {
      const parts = dateStr.split('-').map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN)) return;
      const [y, m, d] = parts;
      const key = calDateKey(y, m - 1, d);
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
  });
  return map;
}

const CAL_MAP_VIEW_HTML = `
<div style="display:grid; grid-template-columns:1fr 320px; gap:14px; align-items:start; font-family:var(--font-body);">
  <div style="background:#fff; border-radius:14px; border:1px solid var(--border-card, #E5E5E5); padding:16px; overflow:hidden;">
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
      <button id="lh-cal-prev" style="width:32px; height:32px; border-radius:8px; border:1px solid var(--border-card, #E5E5E5); background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ea-slate, #47636B)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div id="lh-cal-label" style="font-size:17px; font-weight:var(--fw-bold, 700); color:var(--ea-teal-800, #005F79); font-family:var(--font-body);"></div>
      <button id="lh-cal-next" style="width:32px; height:32px; border-radius:8px; border:1px solid var(--border-card, #E5E5E5); background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ea-slate, #47636B)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
    <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; margin-bottom:6px;">
      ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<div style="text-align:center; font-size:11px; font-weight:var(--fw-bold, 700); color:var(--ea-slate, #47636B); text-transform:uppercase; padding:4px 0; font-family:var(--font-body);">${d}</div>`).join('')}
    </div>
    <div id="lh-cal-grid" style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px;"></div>
  </div>

  <div style="background:#fff; border-radius:14px; border:1px solid var(--border-card, #E5E5E5); padding:14px; min-height:200px;">
    <div id="lh-cal-day-label" style="font-size:14px; font-weight:var(--fw-bold, 700); color:var(--ea-teal-800, #005F79); margin-bottom:10px; font-family:var(--font-body);">Select a day</div>
    <div id="lh-cal-day-programs" style="display:flex; flex-direction:column; gap:8px;"></div>
  </div>
</div>
`;

export function LeagueHubCalendarView({ programs, statusLabels, chipStyle, SubscribeButton, onSubscribe, isMobile, ProgramCard, t }) {
  const rootRef = useRef(null);
  const stateRef = useRef({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    weekStart: calStartOfWeek(new Date()),
    selectedDateKey: null,
    allPrograms: [],
  });
  stateRef.current.isMobile = isMobile;
  stateRef.current.SubscribeButton = SubscribeButton;
  stateRef.current.onSubscribe = onSubscribe;
  stateRef.current.ProgramCard = ProgramCard;
  stateRef.current.t = t;

  useEffect(() => {
    stateRef.current.allPrograms = programs.map(adaptProgram);
    if (stateRef.current.renderCalendar) stateRef.current.renderCalendar();
  }, [programs]);

  useEffect(() => {
    const s = stateRef.current;
    (s.cardRoots || []).forEach((r) => {
      if (s.ProgramCard) r.render(createElement(s.ProgramCard, { program: r.__eaProgram, isMobile: s.isMobile, onSubscribe: s.onSubscribe, stacked: true, t: s.t }));
    });
    if (s.renderCalendar) s.renderCalendar();
  }, [isMobile]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const s = stateRef.current;
    s.cardRoots = s.cardRoots || [];

    function mountProgramCards(container, dayPrograms) {
      s.cardRoots.forEach((r) => r.unmount());
      s.cardRoots = [];
      if (!s.ProgramCard) return;
      container.querySelectorAll('.lh-cal-card-mount').forEach((el, i) => {
        const p = dayPrograms[i];
        if (!p || !p.raw) return;
        const cardRoot = createRoot(el);
        cardRoot.__eaProgram = p.raw;
        cardRoot.render(createElement(s.ProgramCard, { program: p.raw, isMobile: s.isMobile, onSubscribe: s.onSubscribe, stacked: true, t: s.t }));
        s.cardRoots.push(cardRoot);
      });
    }

    function updateSelectionHighlight() {
      const grid = root.querySelector('#lh-cal-grid');
      if (!grid) return;
      grid.querySelectorAll('.lh-cal-day-cell').forEach((cell) => {
        const hasPrograms = cell.dataset.hasPrograms === '1';
        const isSelected = cell.dataset.key === s.selectedDateKey;
        cell.style.background = isSelected ? '#D0F5FF' : '#fff';
        cell.style.borderColor = isSelected ? 'var(--ea-blue, #0092DB)' : 'var(--border-card, #E5E5E5)';
      });
    }

    function renderDayPrograms(dateKey, dayPrograms, dateLabel) {
      const labelEl = root.querySelector('#lh-cal-day-label');
      const listEl = root.querySelector('#lh-cal-day-programs');
      s.selectedDateKey = dateKey;
      if (!dayPrograms || !dayPrograms.length) {
        labelEl.textContent = dateLabel ? `${dateLabel} - no sessions` : 'Select a day';
        listEl.innerHTML = '';
        return;
      }
      labelEl.textContent = `${dateLabel} - ${dayPrograms.length} session${dayPrograms.length > 1 ? 's' : ''}`;
      listEl.innerHTML = dayPrograms.map(() => `<div class="lh-cal-card-mount"></div>`).join('');
      mountProgramCards(listEl, dayPrograms);
    }

    function calDayCellHtml(y, m, dayNum, sessionMap) {
      const key = calDateKey(y, m, dayNum);
      const dayPrograms = sessionMap[key] || [];
      const isSelected = key === s.selectedDateKey;

      let chipsHtml = '';
      if (dayPrograms.length) {
        const maxShown = 2;
        const shortName = (n) => (n.length > 16 ? n.slice(0, 15) + '…' : n);
        chipsHtml = dayPrograms.slice(0, maxShown).map((p) => {
          const c = chipStyle && p.raw && statusLabels ? chipStyle(statusLabels(p.raw)[0]) : { bg: '#D0F5FF', color: '#005F79' };
          return `<div style="font-size:10px; font-weight:var(--fw-semibold, 600); color:${c.color}; background:${c.bg}; border-radius:4px; padding:2px 5px; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-family:var(--font-body);">${shortName(p.name)}</div>`;
        }).join('');
        if (dayPrograms.length > maxShown) {
          chipsHtml += `<div style="font-size:10px; font-weight:var(--fw-semibold, 600); color:var(--ea-slate, #47636B); margin-top:2px; font-family:var(--font-body);">+${dayPrograms.length - maxShown} more</div>`;
        }
      }

      const cellBg = isSelected ? '#D0F5FF' : '#fff';
      const cellBorder = isSelected ? 'var(--ea-blue, #0092DB)' : 'var(--border-card, #E5E5E5)';
      return `
        <div class="lh-cal-day-cell" data-key="${key}" data-has-programs="${dayPrograms.length ? '1' : '0'}" style="border:1.5px solid ${cellBorder}; border-radius:8px; background:${cellBg}; padding:6px; min-height:80px; overflow:hidden; box-sizing:border-box; cursor:${dayPrograms.length ? 'pointer' : 'default'}; transition: background .2s ease, border-color .2s ease;">
          <div style="font-size:12px; font-weight:${dayPrograms.length ? 'var(--fw-bold, 700)' : 'var(--fw-medium, 500)'}; color:${dayPrograms.length ? 'var(--ea-teal-800, #005F79)' : '#9AA6AB'}; text-align:center; font-family:var(--font-body);">${dayNum}</div>
          ${chipsHtml}
        </div>`;
    }

    function renderCalendar() {
      const sessionMap = calBuildSessionMap(s.allPrograms);
      const label = root.querySelector('#lh-cal-label');
      const grid = root.querySelector('#lh-cal-grid');
      if (!label || !grid) return;

      let html = '';

      if (s.isMobile) {
        const weekStart = s.weekStart;
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
        label.textContent = sameMonth
          ? `${CAL_MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`
          : `${CAL_MONTH_NAMES[weekStart.getMonth()].slice(0, 3)} ${weekStart.getDate()} - ${CAL_MONTH_NAMES[weekEnd.getMonth()].slice(0, 3)} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;

        for (let i = 0; i < 7; i++) {
          const d = new Date(weekStart);
          d.setDate(d.getDate() + i);
          html += calDayCellHtml(d.getFullYear(), d.getMonth(), d.getDate(), sessionMap);
        }
        grid.innerHTML = html;
      } else {
        label.textContent = `${CAL_MONTH_NAMES[s.month]} ${s.year}`;

        const firstOfMonth = new Date(s.year, s.month, 1);
        const startWeekday = firstOfMonth.getDay();
        const daysInMonth = new Date(s.year, s.month + 1, 0).getDate();
        const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

        for (let i = 0; i < totalCells; i++) {
          const dayNum = i - startWeekday + 1;
          const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
          if (!inMonth) {
            html += `<div style="min-height:80px; border-radius:8px;"></div>`;
            continue;
          }
          html += calDayCellHtml(s.year, s.month, dayNum, sessionMap);
        }
        grid.innerHTML = html;
      }

      grid.querySelectorAll('.lh-cal-day-cell').forEach((cell) => {
        const key = cell.dataset.key;
        const dayPrograms = sessionMap[key];
        if (!dayPrograms || !dayPrograms.length) return;
        cell.addEventListener('click', () => {
          const [y, m, d] = key.split('-').map(Number);
          const dateLabel = `${CAL_MONTH_NAMES[m]} ${d}, ${y}`;
          s.selectedDateKey = key;
          updateSelectionHighlight();
          renderDayPrograms(key, dayPrograms, dateLabel);
        });
      });

      // Keep the day-programs panel in sync if a date is already selected
      // (e.g. filters changed while a day was open) - re-fetch that day's
      // programs from the freshly-filtered sessionMap rather than leaving
      // the panel showing a stale pre-filter list.
      if (s.selectedDateKey) {
        const [y, m, d] = s.selectedDateKey.split('-').map(Number);
        const dateLabel = `${CAL_MONTH_NAMES[m]} ${d}, ${y}`;
        renderDayPrograms(s.selectedDateKey, sessionMap[s.selectedDateKey] || [], dateLabel);
      }
    }

    s.renderCalendar = renderCalendar;

    root.querySelector('#lh-cal-prev').addEventListener('click', () => {
      if (s.isMobile) {
        s.weekStart = new Date(s.weekStart.getFullYear(), s.weekStart.getMonth(), s.weekStart.getDate() - 7);
      } else {
        s.month--;
        if (s.month < 0) { s.month = 11; s.year--; }
      }
      renderCalendar();
    });
    root.querySelector('#lh-cal-next').addEventListener('click', () => {
      if (s.isMobile) {
        s.weekStart = new Date(s.weekStart.getFullYear(), s.weekStart.getMonth(), s.weekStart.getDate() + 7);
      } else {
        s.month++;
        if (s.month > 11) { s.month = 0; s.year++; }
      }
      renderCalendar();
    });

    renderCalendar();

    return () => {
      s.renderCalendar = null;
      (s.cardRoots || []).forEach((r) => r.unmount());
      s.cardRoots = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        html, body { max-width: 100%; overflow-x: hidden; }
        @media (max-width: 900px) {
          #lh-cal-mobile-wrap > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div id="lh-cal-mobile-wrap" ref={rootRef} style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: CAL_MAP_VIEW_HTML }} />
    </>
  );
}

/* ---- Map view: HTML copied from template-finder.php ---- */
const MAP_VIEW_HTML = `
<div id="lh-map-grid" style="display:grid; grid-template-columns:1fr 340px; gap:14px; align-items:start; font-family:var(--font-body);">
  <div id="lh-map-pane" style="position:relative; height:600px; border-radius:14px; overflow:hidden; border:1px solid var(--border-card, #E5E5E5);">
    <div id="lh-leaflet-map" style="position:absolute; inset:0;"></div>
  </div>

  <div id="lh-list-pane" style="background:#fff; border-radius:14px; border:1px solid var(--border-card, #E5E5E5); height:600px; display:flex; flex-direction:column; overflow:hidden;">
    <div id="lh-panel-search" style="flex:1; overflow-y:auto; display:flex; flex-direction:column;">
      <div id="lh-panel-search-list" style="padding:10px; display:flex; flex-direction:column; gap:8px;"></div>
    </div>
  </div>
</div>
`;

export function LeagueHubMapView({ programs, SubscribeButton, onSubscribe, isMobile, ProgramCard, t }) {
  const rootRef = useRef(null);
  const stateRef = useRef({
    map: null,
    markers: {},
    allPrograms: [],
    selectedId: null,
  });
  stateRef.current.isMobile = isMobile;
  stateRef.current.SubscribeButton = SubscribeButton;
  stateRef.current.onSubscribe = onSubscribe;
  stateRef.current.ProgramCard = ProgramCard;
  stateRef.current.t = t;

  useEffect(() => {
    const s = stateRef.current;
    s.allPrograms = programs.map(adaptProgram);
    if (s.map && s.syncMarkersAndList) {
      s.syncMarkersAndList(window.L, false);
    }
  }, [programs]);

  useEffect(() => {
    const s = stateRef.current;
    (s.cardRoots || []).forEach((r) => {
      if (s.ProgramCard) r.render(createElement(s.ProgramCard, { program: r.__eaProgram, isMobile: s.isMobile, onSubscribe: s.onSubscribe, stacked: true, t: s.t }));
    });
  }, [isMobile]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const s = stateRef.current;
    let cancelled = false;
    s.cardRoots = s.cardRoots || [];

    function mountProgramCards(container, filteredAdapted) {
      s.cardRoots.forEach((r) => r.unmount());
      s.cardRoots = [];
      if (!s.ProgramCard) return;
      container.querySelectorAll('.lh-map-pgm-item').forEach((el, i) => {
        const p = filteredAdapted[i];
        const mount = el.querySelector('.lh-map-card-mount');
        if (!p || !p.raw || !mount) return;
        const cardRoot = createRoot(mount);
        cardRoot.__eaProgram = p.raw;
        cardRoot.render(createElement(s.ProgramCard, { program: p.raw, isMobile: s.isMobile, onSubscribe: s.onSubscribe, stacked: true, t: s.t }));
        s.cardRoots.push(cardRoot);
      });
    }

    /* ---- copied from ea-program-finder.js, field names/DOM ids only ---- */
    function pinIcon(L, badgeKey, selected, hovered) {
      const color = badgeKey === 'full' ? '#9AA6AB' : '#0092DB';
      const size = selected ? 20 : hovered ? 23 : 14;
      return L.divIcon({
        className: '',
        html: `<div style="width:${size}px; height:${size}px; background:${color}; border-radius:50%; border:2.5px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,.3); cursor:pointer; transition: width .12s, height .12s;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    }

    function panelItemHtml(p) {
      return `<div class="lh-map-pgm-item" data-id="${p.id}" style="cursor:pointer;"><div class="lh-map-card-mount"></div></div>`;
    }

    function wirePanelItemClicks(container) {
      container.querySelectorAll('.lh-map-pgm-item').forEach((el) => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('a') || e.target.closest('button')) return;
          const p = s.allPrograms.find((x) => x.id === el.dataset.id);
          if (p) selectProgramOnMap(p);
        });
        el.addEventListener('mouseenter', () => setPinHovered(el.dataset.id, true));
        el.addEventListener('mouseleave', () => setPinHovered(el.dataset.id, false));
      });
    }

    function renderSearchList(query) {
      const q = (query || '').toLowerCase();
      const filtered = s.allPrograms.filter((p) =>
        !q || p.name.toLowerCase().includes(q) || p.sport.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      );
      const list = root.querySelector('#lh-panel-search-list');
      if (!list) return;
      list.innerHTML = filtered.map((p) => panelItemHtml(p)).join('') ||
        `<div style="text-align:center; padding:30px 10px; color:var(--ea-slate, #47636B); font-size:13px; font-family:var(--font-body);">No programs match your filters.</div>`;
      wirePanelItemClicks(list);
      mountProgramCards(list, filtered);
    }

    function selectProgramOnMap(p) {
      const L = window.L;
      s.selectedId = p.id;
      Object.entries(s.markers).forEach(([id, marker]) => {
        const program = s.allPrograms.find((x) => x.id === id);
        if (program) marker.setIcon(pinIcon(L, program.badgeKey, id === p.id, false));
        marker.setZIndexOffset(id === p.id ? 1000 : 0);
      });
      if (s.map && p.lat != null) {
        s.map.flyTo([p.lat, p.lng], Math.max(s.map.getZoom(), 11), { duration: 0.8 });
      }
    }

    function setPinHovered(id, hovered) {
      const L = window.L;
      const marker = s.markers[id];
      const program = s.allPrograms.find((x) => x.id === id);
      if (!marker || !program) return;
      const isSelected = s.selectedId === id;
      marker.setIcon(pinIcon(L, program.badgeKey, isSelected, hovered && !isSelected));
      if (!isSelected) marker.setZIndexOffset(hovered ? 1000 : 0);
    }

    function initMap(L) {
      s.map = L.map(root.querySelector('#lh-leaflet-map'), { scrollWheelZoom: false, attributionControl: false })
        .setView([44.05, -79.45], 10);
      L.control.attribution({ prefix: false, position: 'bottomright' })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>')
        .addTo(s.map);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(s.map);

      const refreshMapSize = () => {
        if (!s.map) return;
        setTimeout(() => {
          const center = s.map.getCenter();
          const zoom = s.map.getZoom();
          s.map.invalidateSize(false);
          s.map.setView(center, zoom, { animate: false });
        }, 60);
      };
      window.addEventListener('resize', refreshMapSize);
      if (window.visualViewport) window.visualViewport.addEventListener('resize', refreshMapSize);

      const mapGridEl = root.querySelector('#lh-map-grid');
      if (mapGridEl && window.ResizeObserver) {
        const observer = new ResizeObserver(refreshMapSize);
        observer.observe(mapGridEl);
        s.resizeObserver = observer;
      }

      syncMarkersAndList(L, true);
    }

    s.syncMarkersAndList = syncMarkersAndList;

    function syncMarkersAndList(L, isInitialLoad) {
      // Create a marker for any program we haven't seen yet (all programs the
      // map has ever been given, keyed by id). Existing markers are never
      // destroyed, only shown/hidden, so selection/hover state isn't lost.
      s.allPrograms.forEach((p) => {
        if (p.lat == null || p.lng == null || s.markers[p.id]) return;
        const marker = L.marker([p.lat, p.lng], { icon: pinIcon(L, p.badgeKey, false) }).addTo(s.map);
        marker.on('click', () => selectProgramOnMap(p));
        s.markers[p.id] = marker;
      });

      const visibleIds = new Set(s.allPrograms.map((p) => p.id));
      Object.entries(s.markers).forEach(([id, marker]) => {
        const onMap = s.map.hasLayer(marker);
        if (visibleIds.has(id) && !onMap) marker.addTo(s.map);
        if (!visibleIds.has(id) && onMap) s.map.removeLayer(marker);
      });

      if (isInitialLoad) {
        const withCoords = s.allPrograms.filter((p) => p.lat != null && p.lng != null);
        if (withCoords.length) {
          const bounds = L.latLngBounds(withCoords.map((p) => [p.lat, p.lng]));
          s.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
        }
      }

      renderSearchList('');
    }

    loadLeaflet().then((L) => {
      if (cancelled) return;
      initMap(L);
    });

    return () => {
      cancelled = true;
      if (s.resizeObserver) { s.resizeObserver.disconnect(); s.resizeObserver = null; }
      if (s.map) { s.map.remove(); s.map = null; }
      s.markers = {};
      s.syncMarkersAndList = null;
      (s.cardRoots || []).forEach((r) => r.unmount());
      s.cardRoots = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        html, body { max-width: 100%; overflow-x: hidden; }
        .lh-hidden { display: none !important; }
        .lh-map-pgm-item:hover { background: var(--ea-mist, #F2F2F2); }
        @media (max-width: 900px) {
          #lh-map-grid { grid-template-columns: 1fr !important; }
          #lh-map-pane { height: 380px !important; }
          #lh-list-pane { height: 440px !important; }
        }
      `}</style>
      <div ref={rootRef} style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: MAP_VIEW_HTML }} />
    </>
  );
}
