export function initCinematic() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
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
      .from('.hero-content > .eyebrow, .hero-bottom', { autoAlpha: 0, y: 22, duration: .9, stagger: .12 }, start + .55);
    gsap.to('.hero-content', { y: 100, opacity: .15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
    gsap.to('.hero-images', { yPercent: 13, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
    gsap.to('.contact-image', { yPercent: 10, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: .8 } });
    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());
    const filters = [...document.querySelectorAll('[data-filter]')];
    const details = [...document.querySelectorAll('.service-list details')];
    filters.forEach(button => button.addEventListener('click', refresh));
    details.forEach(detail => detail.addEventListener('toggle', refresh));
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      document.documentElement.classList.remove('cinematic-motion');
      intro.hidden = true;
      filters.forEach(button => button.removeEventListener('click', refresh));
      details.forEach(detail => detail.removeEventListener('toggle', refresh));
    };
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
