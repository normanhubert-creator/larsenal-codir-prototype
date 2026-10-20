const header = document.querySelector('.site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = Number(el.dataset.parallax || 0.08);
    const rect = el.parentElement.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const offset = (progress - .5) * 120 * speed * 10;
    el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.animate([
      { opacity: 0, transform: 'translateY(26px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 720, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'forwards' });
    observer.unobserve(entry.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
