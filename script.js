/* Saugat Pandey: site behaviour. Every feature checks for its elements first,
   so the same file serves index, misc, and cv. Nothing here is required to
   read the content: with JS off, all papers, updates, and stories show. */
(function () {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (toggle && nav) {
    const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { close(); toggle.focus(); }
    });
  }

  /* ---------- Scrollspy for in-page nav links ---------- */
  const spyLinks = $$('.nav a[href^="#"]');
  if (spyLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(spyLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        spyLinks.forEach(a => a.classList.remove('is-active'));
        const link = byId.get(entry.target.id);
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Publication filter ---------- */
  const chips = $$('.filters .chip');
  const pubs = $$('.pub[data-topics]');
  const count = $('#pub-count');
  if (chips.length && pubs.length) {
    chips.forEach(chip => { chip.dataset.name = chip.textContent.trim(); });
    const label = f => (f === 'all' ? '' : ' on ' + chips.find(c => c.dataset.filter === f).dataset.name.toLowerCase());
    // counts on each chip
    chips.forEach(chip => {
      const f = chip.dataset.filter;
      const n = f === 'all' ? pubs.length : pubs.filter(p => p.dataset.topics.split(' ').includes(f)).length;
      const span = document.createElement('span');
      span.className = 'chip__count';
      span.textContent = n;
      span.setAttribute('aria-hidden', 'true');
      chip.appendChild(span);
      chip.setAttribute('aria-label', `${chip.dataset.name}, ${n} paper${n === 1 ? '' : 's'}`);
    });

    const apply = f => {
      chips.forEach(c => c.setAttribute('aria-pressed', c.dataset.filter === f ? 'true' : 'false'));
      let shown = 0;
      pubs.forEach(p => {
        const on = f === 'all' || p.dataset.topics.split(' ').includes(f);
        p.hidden = !on;
        if (on) shown++;
      });
      $$('.pub-group').forEach(g => { g.hidden = !$$('.pub', g).some(p => !p.hidden); });
      if (count) count.textContent = f === 'all' ? `Showing all ${shown} papers` : `Showing ${shown} paper${shown === 1 ? '' : 's'}${label(f)}`;
    };
    chips.forEach(c => c.addEventListener('click', () => apply(c.dataset.filter)));
    apply('all');

    // "See the papers" buttons in the Research section
    $$('[data-jump]').forEach(btn => btn.addEventListener('click', () => {
      apply(btn.dataset.jump);
      const target = $('#publications');
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      const active = chips.find(c => c.dataset.filter === btn.dataset.jump);
      if (active) active.focus({ preventScroll: true });
    }));
  }

  /* ---------- Updates: show the first six, reveal the rest on request ---------- */
  const updatesToggle = $('#updates-toggle');
  const updates = $$('#updates .update');
  const VISIBLE = 6;
  if (updatesToggle && updates.length > VISIBLE) {
    const set = expanded => {
      updates.forEach((u, i) => { u.hidden = !expanded && i >= VISIBLE; });
      updatesToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      updatesToggle.textContent = expanded ? 'Show fewer updates' : `Show all ${updates.length} updates`;
    };
    updatesToggle.hidden = false;
    set(false);
    updatesToggle.addEventListener('click', () => {
      const expanded = updatesToggle.getAttribute('aria-expanded') === 'true';
      set(!expanded);
      // move focus to the first newly revealed update so keyboard users land on new content
      if (!expanded) { updates[VISIBLE].setAttribute('tabindex', '-1'); updates[VISIBLE].focus(); }
    });
  }

  /* ---------- Contact form (Formspree) ---------- */
  const form = $('#contact-form');
  const status = $('#form-status');
  if (form && status) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const invalid = $$('[required]', form).find(el => !el.value.trim() || (el.type === 'email' && !el.checkValidity()));
      if (invalid) {
        status.className = 'form-status is-error';
        const name = form.querySelector(`label[for="${invalid.id}"]`).textContent.trim();
        status.textContent = invalid.type === 'email' && invalid.value.trim() ? 'Please enter a valid email address.' : `Please fill in your ${name.toLowerCase()}.`;
        invalid.setAttribute('aria-invalid', 'true');
        invalid.focus();
        return;
      }
      $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.className = 'form-status is-ok';
        status.textContent = "Thanks! Your message is on its way. I'll reply soon.";
      } catch (err) {
        status.className = 'form-status is-error';
        status.textContent = 'That didn’t go through. Please email spandey2@furman.edu instead.';
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* ---------- Misc: filter stories ---------- */
  const storyChips = $$('.story-filters .chip');
  const stories = $$('.story[data-category]');
  if (storyChips.length && stories.length) {
    storyChips.forEach(chip => chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      storyChips.forEach(c => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
      stories.forEach(s => { s.hidden = !(f === 'all' || s.dataset.category === f); });
    }));
  }

  /* ---------- Misc: photo gallery (native <dialog>) ---------- */
  const dialog = $('#gallery');
  if (dialog && typeof dialog.showModal === 'function') {
    const img = $('#gallery-img');
    const counter = $('#gallery-count');
    const title = $('#gallery-title');
    let set = [], idx = 0, opener = null;

    const show = i => {
      idx = (i + set.length) % set.length;
      img.src = set[idx].src;
      img.alt = set[idx].alt;
      counter.textContent = `${idx + 1} of ${set.length}`;
    };

    $$('.photos').forEach(group => {
      const buttons = $$('button', group);
      const items = buttons.map(b => ({ src: b.dataset.full, alt: b.querySelector('img').alt }));
      buttons.forEach((b, i) => b.addEventListener('click', () => {
        set = items; opener = b;
        title.textContent = group.dataset.title || 'Photos';
        show(i);
        dialog.showModal();
      }));
    });

    $('#gallery-prev').addEventListener('click', () => show(idx - 1));
    $('#gallery-next').addEventListener('click', () => show(idx + 1));
    $('#gallery-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    dialog.addEventListener('click', e => { if (e.target === dialog || e.target.classList.contains('gallery__stage')) dialog.close(); });
    dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  }
})();
