export function initCinematic() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  const film = document.querySelector('.design-film');
  const chapters = [...document.querySelectorAll('.film-chapter')];
  const chapterButtons = [...document.querySelectorAll('[data-chapter]')];
  let activeChapter = 0;
  function chapter(index, animate = true) {
    if (index === activeChapter && animate) return;
    activeChapter = index;
    chapters.forEach((element, i) => {
      element.classList.toggle('active', i === index);
      element.setAttribute('aria-hidden', String(i !== index));
      if (animate) gsap.to(element, { autoAlpha: i === index ? 1 : 0, y: i === index ? 0 : -24, duration: .65, ease: 'power2.out', overwrite: true });
    });
    chapterButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }
  chapter(0, false);
  media.add('(prefers-reduced-motion: no-preference)', () => {
    document.documentElement.classList.add('cinematic-motion');
    const opening = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const intro = document.querySelector('.cinema-intro');
    const atTop = !location.hash && scrollY < 80;
    if (atTop) {
      intro.hidden = false;
      opening.from('.intro-signature', { autoAlpha: 0, y: 14, duration: .45 })
        .from('.intro-signature i', { scaleX: 0, duration: .55 }, '<.1')
        .to('.intro-signature', { autoAlpha: 0, y: -15, duration: .35 }, '.8')
        .to('.intro-panel-top', { yPercent: -101, duration: .9, ease: 'power3.inOut' }, '.9')
        .to('.intro-panel-bottom', { yPercent: 101, duration: .9, ease: 'power3.inOut' }, '<')
        .set(intro, { display: 'none' });
    }
    const start = atTop ? 1.15 : 0;
    opening.from('.hero-line > *', { yPercent: 115, rotation: 3, duration: 1.35, stagger: .16 }, start)
      .from('.hero-content > .eyebrow, .hero-bottom, .tour-link', { autoAlpha: 0, y: 22, duration: .9, stagger: .12 }, start + .55);
    gsap.to('.hero-content', { y: 100, opacity: .15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
    gsap.to('.hero-images', { yPercent: 13, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
    gsap.to('.reading-progress', { scaleX: 1, transformOrigin: 'left', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });
    const story = gsap.timeline({ scrollTrigger: { trigger: film, start: 'top top', end: 'bottom bottom', scrub: .8, onUpdate: self => chapter(Math.min(2, Math.floor(self.progress * 3))) } });
    story.fromTo('.film-photo', { scale: 1.22, xPercent: -4 }, { scale: 1.04, xPercent: 2, duration: 3, ease: 'none' }, 0)
      .fromTo('.film-blueprint', { opacity: .55, scale: 1 }, { opacity: 0, scale: 1.14, duration: 1.25, ease: 'none' }, 0);
    gsap.to('.contact-image', { yPercent: 10, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: .8 } });
    const onChapterClick = event => {
      const index = Number(event.currentTarget.dataset.chapter);
      const bounds = film.getBoundingClientRect();
      const startY = scrollY + bounds.top;
      const distance = film.offsetHeight - innerHeight;
      window.scrollTo({ top: startY + distance * ((index + .45) / 3), behavior: 'smooth' });
    };
    chapterButtons.forEach(button => button.addEventListener('click', onChapterClick));
    const filters = [...document.querySelectorAll('[data-filter]')];
    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());
    filters.forEach(button => button.addEventListener('click', refresh));
    document.querySelectorAll('.service-list details').forEach(detail => detail.addEventListener('toggle', refresh));
    const fontRefresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(fontRefresh);
    return () => {
      document.documentElement.classList.remove('cinematic-motion');
      intro.hidden = true;
      chapterButtons.forEach(button => button.removeEventListener('click', onChapterClick));
      filters.forEach(button => button.removeEventListener('click', refresh));
      document.querySelectorAll('.service-list details').forEach(detail => detail.removeEventListener('toggle', refresh));
      chapters.forEach(element => gsap.set(element, { clearProps: 'all' }));
    };
  });
  media.add('(prefers-reduced-motion: reduce)', () => {
    const choose = event => chapter(Number(event.currentTarget.dataset.chapter), false);
    chapterButtons.forEach(button => button.addEventListener('click', choose));
    return () => chapterButtons.forEach(button => button.removeEventListener('click', choose));
  });
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const hero = document.querySelector('.hero');
    const xTo = gsap.quickTo('.hero-images', 'x', { duration: 1.4, ease: 'power3.out' });
    const move = event => xTo((event.clientX / innerWidth - .5) * -25);
    const leave = () => xTo(0);
    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', leave);
    return () => { hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); };
  });
  return media;
}
