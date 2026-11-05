(() => {
  const page = document.body.dataset.page || 'home';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced');

  /* shared chrome */
  const links = [['inquiry', 'Inquiry', 'inquiry.html'], ['about', 'About us', 'about.html'], ['news', 'News', 'news.html'], ['contact', 'Contact', 'contact.html']];
  const navLinks = links.map(([k, t, h]) => `<li><a href="${h}"${k === page ? ' aria-current="page"' : ''}>${t}</a></li>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="nav" id="nav">
    <a class="logo" href="index.html" aria-label="Pharmasan home"><img src="assets/img/logo_p.png" alt="Pharmasan" width="802" height="76"></a>
    <nav aria-label="Main"><ul>${navLinks}<li><a class="btn desk" href="inquiry.html">Send inquiry <span class="arr">→</span></a></li></ul></nav>
    <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
  </header>
  <div class="mobile-menu" aria-hidden="true">
    <div>${links.map(([, t, h]) => `<a class="big" href="${h}">${t}</a>`).join('')}</div>
    <div class="mono">+386 31 274 674<br>info@pharmasan.si</div>
  </div>`);

  const footer = document.getElementById('footer');
  if (footer) footer.outerHTML = `
  <footer class="footer">
    <div>
      <a class="logo" href="index.html"><img src="assets/img/logo_p.png" alt="Pharmasan" width="802" height="76"></a>
      <p style="margin-top:28px;color:var(--gray);max-width:34ch">Distribution, storage and marketing of pharmaceuticals and medical devices.</p>
    </div>
    <div><h5>Company</h5><ul><li><a href="about.html">About us</a></li><li><a href="news.html">News</a></li><li><a href="https://tempcontroller.net" target="_blank" rel="noopener">TempController</a></li></ul></div>
    <div><h5>Work with us</h5><ul><li><a href="inquiry.html">Inquiry</a></li><li><a href="contact.html">Contact</a></li><li><a href="index.html#services">Products</a></li></ul></div>
    <div><h5>Pharmasan d.o.o.</h5><ul><li>Kogovškova 22</li><li>1000 Ljubljana</li><li>Slovenia, EU</li></ul></div>
    <div class="bottom"><p>© ${new Date().getFullYear()} Pharmasan d.o.o. All rights reserved.</p><p>GDP certified supplier</p></div>
  </footer>`;

  const nav = document.getElementById('nav');
  const burger = nav.querySelector('.burger');
  burger.addEventListener('click', () => {
    const open = document.documentElement.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });

  /* smooth scroll */
  let lenis;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({ start: 40, end: 'max', onToggle: s => nav.classList.toggle('solid', s.isActive) });

  /* loader: mark + counter, then content */
  const loader = document.querySelector('.loader');
  const intro = gsap.timeline({ paused: true });
  function startIntro() {
    intro.play();
    // safety net: if animation frames stall (background tab, thumbnail capture), show the end state
    setTimeout(() => { if (intro.progress() < 1) intro.progress(1); }, 2500);
  }
  if (loader && !reduced && !sessionStorageSeen()) {
    const count = loader.querySelector('.count'), bar = loader.querySelector('.bar'), o = { v: 0 };
    gsap.timeline({ onComplete: startIntro })
      .from(loader.querySelector('.mark'), { scale: .6, opacity: 0, duration: .6, ease: 'power3.out' })
      .to(o, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { count.textContent = Math.round(o.v); bar.style.width = o.v + '%'; } }, 0)
      .to(loader.querySelector('.mark'), { opacity: 0, scale: .9, duration: .35 })
      .to(loader, { yPercent: -100, duration: .9, ease: 'power4.inOut' }, '-=.1')
      .set(loader, { display: 'none' });
  } else {
    if (loader) loader.style.display = 'none';
    startIntro();
  }
  function sessionStorageSeen() {
    try { const s = sessionStorage.getItem('ps-seen'); sessionStorage.setItem('ps-seen', '1'); return !!s; } catch (e) { return false; }
  }

  /* intro: headline lines rise */
  const lines = document.querySelectorAll('[data-lines] .line > span');
  if (lines.length && !reduced) {
    intro.from(lines, { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: .09 })
      .from('.hero .pillars span, .page-hero .lead, .page-hero .btn', { opacity: 0, y: 16, duration: .8, stagger: .08, ease: 'power3.out' }, '-=.7')
      .from('.hero-media', { clipPath: 'inset(30% 30% 0% 30% round 8px)', duration: 1.4, ease: 'power4.inOut' }, '-=1');
  }

  /* generic reveals */
  gsap.utils.toArray('.rv').forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  /* mini parallax inside frames */
  gsap.utils.toArray('[data-parallax] img').forEach(img => {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* hero image widens to full bleed */
  const hm = document.querySelector('.hero-media');
  if (hm && !reduced) {
    gsap.to(hm, { clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'none', scrollTrigger: { trigger: hm, start: 'top 75%', end: 'top 10%', scrub: true } });
  }

  /* split statement: image expands, words part */
  const split = document.querySelector('.split');
  if (split && !reduced) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: split, start: 'top top', end: 'bottom bottom', scrub: 1 } });
    tl.to(split.querySelector('.words span:first-child'), { xPercent: -60, opacity: 0, ease: 'power1.in', duration: 1 }, 0)
      .to(split.querySelector('.words span:last-child'), { xPercent: 60, opacity: 0, ease: 'power1.in', duration: 1 }, 0)
      .to(split.querySelector('.frame'), { width: '100vw', height: '100vh', borderRadius: 0, ease: 'power2.inOut', duration: 1.2 }, 0.1)
      .to(split.querySelector('.frame img'), { scale: 1, ease: 'power2.inOut', duration: 1.2 }, 0.1)
      .to(split.querySelector('.shade'), { opacity: 1, duration: .4 }, 1)
      .to(split.querySelector('.over'), { opacity: 1, duration: .4 }, 1.1)
      .from(split.querySelector('.over p'), { y: 50, duration: .5 }, 1.1)
      .to({}, { duration: .4 });
  }

  /* gray to navy text fill */
  document.querySelectorAll('[data-fill]').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    const ws = el.querySelectorAll('.w');
    if (reduced) { ws.forEach(w => w.style.color = 'var(--ink)'); return; }
    gsap.to(ws, { color: 'var(--ink)', stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  });

  /* facts: pinned counter stage + europe routes */
  const facts = document.querySelector('.facts');
  if (facts) setupFacts(facts);

  function setupFacts(sec) {
    const C = {"Ljubljana":[507,507.8],"Vienna":[531.2,464.7],"Berlin":[492.8,379.9],"Amsterdam":[390.4,376.2],"Paris":[349.1,440.5],"Madrid":[232.4,588.1],"Rome":[477.7,590.2],"Warsaw":[584.8,381.7],"Stockholm":[541.6,243.5],"Athens":[654.5,659],"Bucharest":[670.9,526.1],"Dublin":[263.6,331.1],"Lisbon":[142,598.1],"Copenhagen":[484,317.2],"Zagreb":[527.4,512.3],"Belgrade":[590.9,529],"Sarajevo":[563.2,549.5],"Skopje":[610.1,582.9],"Budapest":[567.3,476.9],"Prague":[505.3,428.2],"Helsinki":[608.9,219.7],"Brussels":[379.9,405.2],"Milan":[433.1,517.5],"Sofia":[636.2,565.9]};
    const svg = sec.querySelector('.eu-map'), NS = 'http://www.w3.org/2000/svg';
    const arcs = svg.querySelector('.arcs'), pins = svg.querySelector('.pins');
    const hub = C.Ljubljana;
    const groups = [
      ['Zagreb', 'Belgrade', 'Sarajevo', 'Skopje'],
      ['Vienna', 'Milan', 'Budapest', 'Prague', 'Rome', 'Sofia'],
      ['Berlin', 'Warsaw', 'Paris', 'Brussels', 'Amsterdam', 'Bucharest', 'Athens'],
      ['Madrid', 'Lisbon', 'Dublin', 'Copenhagen', 'Stockholm', 'Helsinki']
    ];
    const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
    const groupEls = groups.map(g => g.map(name => {
      const [x, y] = C[name], mx = (hub[0] + x) / 2, my = (hub[1] + y) / 2 - Math.hypot(x - hub[0], y - hub[1]) * .28;
      const p = mk('path', { d: `M${hub[0]},${hub[1]} Q${mx},${my} ${x},${y}` }, arcs);
      const c = mk('circle', { cx: x, cy: y, r: 6.5 }, pins);
      return { p, c };
    }));
    mk('circle', { cx: hub[0], cy: hub[1], r: 14, class: 'ring' }, pins);
    mk('circle', { cx: hub[0], cy: hub[1], r: 6, class: 'hub' }, pins);
    const tag = sec.querySelector('.map-tag');
    const placeTag = () => { const r = svg.getBoundingClientRect(), mr = sec.querySelector('.map').getBoundingClientRect(); tag.style.left = (r.left - mr.left + hub[0] / 1000 * r.width) + 'px'; tag.style.top = (r.top - mr.top + hub[1] / 820 * r.height) + 'px'; };
    placeTag(); addEventListener('resize', placeTag);

    // arcs hidden by clipping their length; dashed look is kept by a mask-free trick: animate opacity + scale from hub
    groupEls.flat().forEach(({ p, c }) => { gsap.set(p, { opacity: 0 }); gsap.set(c, { scale: 0, transformOrigin: 'center' }); });
    gsap.to(svg.querySelector('.ring'), { attr: { r: 26 }, opacity: 0, duration: 1.8, repeat: -1, ease: 'power1.out' });

    const facts = sec.querySelectorAll('.fact'), bars = sec.querySelectorAll('.progress b');
    const nums = [...facts].map(f => f.querySelector('[data-to]'));
    gsap.set([...facts].slice(1), { opacity: 0, yPercent: 30 });
    const showGroup = (i, on) => groupEls[i] && groupEls[i].forEach(({ p, c }, j) => {
      gsap.to(p, { opacity: on ? .9 : 0, duration: .5, delay: on ? j * .06 : 0, overwrite: true });
      gsap.to(c, { scale: on ? 1 : 0, duration: .5, delay: on ? .2 + j * .06 : 0, ease: 'back.out(2)', overwrite: true });
    });
    const count = (el) => { const to = +el.dataset.to, from = +(el.dataset.from || 0), o = { v: from }; gsap.to(o, { v: to, duration: 1.2, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v) }); };

    if (reduced || matchMedia('(max-width:1100px)').matches) {
      groups.forEach((_, i) => showGroup(i, true));
      gsap.set(facts, { opacity: 1, yPercent: 0, position: 'relative' });
      sec.querySelector('.nums').style.height = 'auto';
      sec.querySelectorAll('.fact').forEach(f => f.style.marginBottom = '40px');
      bars.forEach(b => gsap.set(b, { scaleX: 1 }));
      return;
    }
    let cur = -1;
    const go = (i) => {
      if (i === cur) return;
      facts.forEach((f, k) => gsap.to(f, { opacity: k === i ? 1 : 0, yPercent: k === i ? 0 : (k < i ? -30 : 30), duration: .7, ease: 'power3.out', overwrite: true }));
      bars.forEach((b, k) => gsap.to(b, { scaleX: k <= i ? 1 : 0, duration: .5, overwrite: true }));
      groups.forEach((_, k) => showGroup(k, k <= i));
      if (i > cur && nums[i]) count(nums[i]);
      cur = i;
    };
    ScrollTrigger.create({
      trigger: sec, start: 'top top', end: () => '+=' + innerHeight * 3, pin: sec.querySelector('.pin'), anticipatePin: 1,
      onUpdate: s => go(Math.min(3, Math.floor(s.progress * 4 * .999))),
      onEnter: () => go(0)
    });
  }

  /* audience peek image follows cursor */
  const aud = document.querySelector('.aud');
  const peek = document.querySelector('.aud-peek');
  if (aud && peek && matchMedia('(hover:hover)').matches) {
    const imgs = peek.querySelectorAll('img');
    const xTo = gsap.quickTo(peek, 'x', { duration: .6, ease: 'power3' }), yTo = gsap.quickTo(peek, 'y', { duration: .6, ease: 'power3' });
    aud.addEventListener('mousemove', e => { xTo(e.clientX + 30); yTo(e.clientY - peek.offsetHeight / 2); });
    aud.querySelectorAll('a').forEach((a, i) => a.addEventListener('mouseenter', () => { imgs.forEach((im, k) => im.classList.toggle('on', k === i)); }));
    aud.addEventListener('mouseenter', () => gsap.to(peek, { opacity: 1, scale: 1, duration: .4 }));
    aud.addEventListener('mouseleave', () => gsap.to(peek, { opacity: 0, scale: .85, duration: .3 }));
  }

  /* timeline rail */
  const tl = document.querySelector('.tl');
  if (tl) {
    const yrs = tl.querySelectorAll('.yr');
    if (reduced) yrs.forEach(y => y.classList.add('on'));
    else {
      gsap.to(tl.querySelector('.rail b'), { scaleX: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 55%', scrub: true,
        onUpdate: s => yrs.forEach((y, i) => y.classList.toggle('on', s.progress >= i / (yrs.length - 1) - .02)) } });
      gsap.from(yrs, { y: 40, opacity: 0, duration: .9, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: tl, start: 'top 85%' } });
    }
  }

  /* temperature monitor: live drawing curve */
  const chart = document.querySelector('.chart svg');
  if (chart) {
    const W = 700, H = 300, N = 70, lo = 90, hi = 210, pts = [];
    let t = 0;
    const val = (k) => 150 + Math.sin(k * .18) * 26 + Math.sin(k * .53) * 9 + Math.sin(k * 1.7) * 3;
    for (let i = 0; i < N; i++) pts.push(val(i));
    const curve = chart.querySelector('.curve'), area = chart.querySelector('.area'), dot = chart.querySelector('.head-dot');
    const reading = document.querySelector('.chart .reading span');
    const draw = (shift) => {
      const step = W / (N - 1);
      const d = pts.map((y, i) => `${i ? 'L' : 'M'}${(i - shift) * step},${y.toFixed(1)}`).join('');
      curve.setAttribute('d', d);
      area.setAttribute('d', d + `L${(N - 1 - shift) * step},${H}L${-shift * step},${H}Z`);
      const last = pts[N - 1];
      dot.setAttribute('cx', (N - 1 - shift) * step); dot.setAttribute('cy', last);
      // map y (lo..hi) to 25.0..15.0 °C
      reading.textContent = (25 - (last - lo) / (hi - lo) * 10).toFixed(1);
    };
    draw(0);
    if (!reduced) {
      let acc = 0, k = N;
      gsap.ticker.add((time, dt) => {
        acc += dt / 900;
        if (acc >= 1) { acc -= 1; pts.shift(); pts.push(val(k++)); }
        draw(acc);
      });
    }
  }

  /* inquiry: preselect from query */
  const qs = new URLSearchParams(location.search);
  ['org', 'product'].forEach(k => {
    const v = qs.get(k); if (!v) return;
    const el = document.querySelector(`input[name="${k}"][value="${v}"]`); if (el) el.checked = true;
  });
  document.querySelectorAll('form.f').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    f.querySelectorAll('label, .full:not(.sent)').forEach(el => el.style.display = 'none');
    f.querySelector('.sent').classList.add('on');
    lenis ? lenis.scrollTo(f, { offset: -140 }) : f.scrollIntoView();
  }));

  addEventListener('load', () => ScrollTrigger.refresh());
})();
