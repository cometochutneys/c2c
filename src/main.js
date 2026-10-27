document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Footer year
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  const nav = $('#nav');
  const toggle = $('#navToggle');
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', nav).forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Scroll progress + header state
  const progress = $('#scrollProgress');
  const header = $('.site-header');
  const updateScrollUI = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? doc.scrollTop / max : 0})`;
    if (header) header.classList.toggle('scrolled', window.scrollY > 16);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);

  // Menu tabs
  const tabs = $$('.tab');
  const panels = $$('.menu-panel');
  const search = $('#menuSearch');
  const shell = $('.menu-shell');
  const resultLabel = $('#menuResults');
  const emptyState = $('#menuEmpty');

  function activateTab(id, shouldScroll = false) {
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === id));
    panels.forEach(panel => panel.classList.toggle('active', panel.id === id));
    if (shouldScroll) {
      const menu = $('#menu');
      if (menu) menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (search && search.value) {
        search.value = '';
        runSearch('');
      }
      activateTab(tab.dataset.tab);
      tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });

  // Signature links jump directly to relevant menu category
  $$('.menu-jump').forEach(link => {
    link.addEventListener('click', () => {
      if (search) search.value = '';
      runSearch('');
      activateTab(link.dataset.menuTab, true);
    });
  });

  // Search the entire menu, not only the active tab
  const allItems = $$('.menu-item');
  function runSearch(raw) {
    const query = raw.trim().toLowerCase();
    const searching = query.length > 0;
    if (shell) shell.classList.toggle('searching', searching);

    let matches = 0;
    panels.forEach(panel => {
      const panelItems = $$('.menu-item', panel);
      let panelMatches = 0;
      panelItems.forEach(item => {
        const match = !searching || item.textContent.toLowerCase().includes(query);
        item.classList.toggle('search-hidden', searching && !match);
        if (searching && match) {
          matches += 1;
          panelMatches += 1;
        }
      });
      panel.classList.toggle('panel-no-match', searching && panelMatches === 0);
      $$('.menu-subhead, .menu-note-banner', panel).forEach(el => {
        el.classList.toggle('search-hidden', searching);
      });
    });

    if (!searching) {
      allItems.forEach(item => item.classList.remove('search-hidden'));
      panels.forEach(panel => panel.classList.remove('panel-no-match'));
      $$('.menu-subhead, .menu-note-banner').forEach(el => el.classList.remove('search-hidden'));
      if (resultLabel) resultLabel.textContent = 'Browse all dishes';
      if (emptyState) emptyState.hidden = true;
      return;
    }

    if (resultLabel) resultLabel.textContent = `${matches} ${matches === 1 ? 'dish' : 'dishes'} found`;
    if (emptyState) emptyState.hidden = matches !== 0;
  }
  if (search) search.addEventListener('input', e => runSearch(e.target.value));

  // Live open / closed status in Eastern time
  const HOURS = {
    0: [[9 * 60, 14 * 60 + 30], [17 * 60 + 30, 21 * 60 + 30]],
    1: [],
    2: [[11 * 60 + 30, 14 * 60 + 30], [17 * 60, 22 * 60]],
    3: [[11 * 60 + 30, 14 * 60 + 30], [17 * 60, 22 * 60]],
    4: [[11 * 60 + 30, 14 * 60 + 30], [17 * 60, 22 * 60]],
    5: [[11 * 60 + 30, 14 * 60 + 30], [17 * 60, 22 * 60]],
    6: [[9 * 60, 14 * 60 + 30], [17 * 60 + 30, 22 * 60]],
  };
  const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function easternNow() {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false,
    });
    const parts = {};
    formatter.formatToParts(new Date()).forEach(part => { parts[part.type] = part.value; });
    let hour = Number(parts.hour);
    if (hour === 24) hour = 0;
    return { day: WEEKDAY_INDEX[parts.weekday], minutes: hour * 60 + Number(parts.minute) };
  }

  function updateStatus() {
    const dot = $('#statusDot');
    const text = $('#statusText');
    if (!dot || !text) return;
    const { day, minutes } = easternNow();
    const ranges = HOURS[day] || [];
    const currentRange = ranges.find(([start, end]) => minutes >= start && minutes < end);
    const isOpen = Boolean(currentRange);
    dot.classList.toggle('open', isOpen);
    dot.classList.toggle('closed', !isOpen);
    text.textContent = isOpen ? 'Open now · kitchen is cooking' : 'Closed now · see today’s hours below';
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  // Scroll reveal
  const revealEls = $$('.reveal:not(.in-view)');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Gentle pointer movement on the hero art (desktop only)
  const heroArt = $('.hero-art');
  const heroDish = $('.hero-dish');
  if (heroArt && heroDish && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroArt.addEventListener('pointermove', e => {
      const rect = heroArt.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroDish.style.setProperty('--mx', `${x * 10}px`);
      heroDish.style.setProperty('--my', `${y * 10}px`);
    });
    heroArt.addEventListener('pointerleave', () => {
      heroDish.style.removeProperty('--mx');
      heroDish.style.removeProperty('--my');
    });
  }
  // Interactive chutney flavor explorer
  const chutneyLab = $('.chutney-lab');
  const chutneyChoices = $$('.chutney-choice');
  const chutneyData = {
    coconut: { number: '01 / COCONUT', title: 'Cool, creamy, classic.', description: 'Soft coconut richness settles the spice, rounds out sambar and gives steamed idly its most comforting pairing.', image: 'images/graphics/chutney-coconut.png', alt: 'Coconut chutney in a brass bowl' },
    tomato: { number: '02 / TOMATO', title: 'Tangy, roasted, bright red.', description: 'Sun-ripe tomato cooked down with red chile for a tangy, slightly sweet heat that cuts through a buttery dosa.', image: 'images/graphics/chutney-tomato.png', alt: 'Tomato chutney in a brass bowl' },
    peanut: { number: '03 / PEANUT', title: 'Nutty, toasted, deeply savory.', description: 'Roasted peanuts ground into a thick, earthy chutney — the one regulars end up asking for by name.', image: 'images/graphics/chutney-peanut.png', alt: 'Peanut chutney in a brass bowl' },
  };
  chutneyChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      const flavor = choice.dataset.flavor;
      const data = chutneyData[flavor];
      if (!data || !chutneyLab) return;
      chutneyLab.dataset.chutney = flavor;
      chutneyChoices.forEach(btn => {
        const active = btn === choice;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      const number = $('#chutneyNumber');
      const title = $('#chutneyTitle');
      const description = $('#chutneyDescription');
      const flightImg = $('#chutneyFlightImg');
      if (number) number.textContent = data.number;
      if (title) title.textContent = data.title;
      if (description) description.textContent = data.description;
      if (flightImg && data.image) {
        flightImg.src = data.image;
        flightImg.alt = data.alt || '';
      }
    });
  });

  // Subtle perspective on signature cards for pointer devices
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const ry = (px - 0.5) * 5;
        const rx = (0.5 - py) * 5;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        card.style.setProperty('--tilt-x', `${px * 100}%`);
        card.style.setProperty('--tilt-y', `${py * 100}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }

});
