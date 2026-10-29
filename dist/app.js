import { initCinematic } from './cinematic.js';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = $('#header');
const heroVisibility = new IntersectionObserver(entries => { document.body.classList.toggle('hero-visible', entries[0].isIntersecting); });
heroVisibility.observe($('#home'));
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 60), { passive: true });
header.classList.toggle('scrolled', scrollY > 60);
const menu = $('.menu-toggle'), mobileNav = $('#mobile-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); mobileNav.classList.remove('open'); mobileNav.inert = true; header.classList.remove('menu-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); mobileNav.classList.toggle('open', open); mobileNav.inert = !open; header.classList.toggle('menu-open', open); });
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.documentElement.classList.add('motion-ready');
const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); reveal.unobserve(entry.target); } }), { threshold: .08 });
$$('.reveal').forEach(element => reveal.observe(element));
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  $$('[data-filter]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
  $$('.project-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; card.classList.add('in-view'); });
}));
const consultDialog = $('#consult-dialog');
function openConsult(event) { event?.preventDefault(); closeMenu(); if (!consultDialog.open) consultDialog.showModal(); }
$$('[data-consult]').forEach(button => button.addEventListener('click', openConsult));
$$('dialog').forEach(dialog => { dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close()); dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } }); });
$('#consult-form').addEventListener('submit', event => {
  event.preventDefault(); const data = new FormData(event.target);
  const text = `Hi Future Tech Interiors! I'd like to discuss my project.\n\nName: ${data.get('name').trim()}\nPhone: ${data.get('phone').trim()}\nLocation: ${data.get('location').trim()}\nProject: ${data.get('service')}${data.get('message').trim() ? '\nVision: ' + data.get('message').trim() : ''}`;
  const url = `https://wa.me/918460493993?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  const note = $('#form-note'); note.replaceChildren(document.createTextNode('Your enquiry is ready. If WhatsApp didn’t open, ')); const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'tap here to continue'; link.style.textDecoration = 'underline'; note.append(link, document.createTextNode('. Nothing is sent until you confirm in WhatsApp.'));
});
const projectData = [
  { title: 'The quiet retreat', category: 'RESIDENTIAL / DESIGN CONCEPT', image: 'living.jpg', text: 'A calm, contemporary design direction built around warm timber, soft neutrals and generous natural light. Thoughtful furniture placement makes everyday life flow, while tactile finishes add a sense of quiet comfort.' },
  { title: 'Everyday, elevated', category: 'KITCHEN & LIVING / DESIGN CONCEPT', image: 'kitchen.jpg', text: 'An open, connected space for cooking, sharing and coming together. A clean material palette and intuitive planning balance practical storage with an inviting, uncluttered feel. Every detail has a place.' },
  { title: 'A softer sanctuary', category: 'RESIDENTIAL / DESIGN CONCEPT', image: 'bedroom.jpg', text: 'A personal retreat shaped by soft textures, restrained colour and considered lighting. Layered fabrics and natural materials create a restful atmosphere, with storage planned to keep your sanctuary beautifully simple.' },
  { title: 'The gathering place', category: 'COMMERCIAL LOUNGE / DESIGN CONCEPT', image: 'detail.jpg', text: 'An inviting lounge direction for spaces that bring people together. Comfortable seating, warm finishes and carefully layered lighting create a welcoming first impression. The layout can be adapted around your brand and visitor experience.' }
];
$$('[data-project]').forEach(button => button.addEventListener('click', () => { const p = projectData[Number(button.dataset.project)]; $('#project-detail-image').src = `/assets/${p.image}`; $('#project-detail-image').alt = button.querySelector('img').alt; $('#project-detail-title').textContent = p.title; $('#project-detail-category').textContent = p.category; $('#project-detail-text').textContent = p.text; $('#project-dialog').showModal(); }));
$('#discuss-project').addEventListener('click', () => { $('#project-dialog').close(); openConsult(); });
$('#year').textContent = new Date().getFullYear();
let roomLoaded = false;
const roomObserver = new IntersectionObserver(entries => { if (entries[0].isIntersecting && !roomLoaded) { roomLoaded = true; import('./room.js').then(module => module.initRoom()).catch(() => { $('#room-canvas').innerHTML = '<img src="/assets/living.jpg" alt="A completed interior design concept with warm natural materials">'; }); roomObserver.disconnect(); } }, { rootMargin: '400px' });
roomObserver.observe($('#experience'));
initCinematic();
