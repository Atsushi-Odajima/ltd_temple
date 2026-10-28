// All navigation works without JavaScript; enhancement adds a menu and image dialog.
const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-nav');
const mobile = window.matchMedia('(max-width: 800px)');
function closeMenu(restoreFocus = false) {
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('span').textContent = '＋';
  if (restoreFocus) menuButton.focus();
}
if (header && menuButton && navigation) {
  menuButton.hidden = false;
  header.classList.add('menu-enhanced');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('span').textContent = open ? '−' : '＋';
  });
  navigation.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !mobile.matches) return;
    closeMenu();
    // Move focus out of the newly hidden mobile navigation to the destination.
    const destination = document.querySelector(link.getAttribute('href'));
    if (destination) {
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
      destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once: true });
    }
  });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) closeMenu(true);
  });
  mobile.addEventListener('change', () => closeMenu());
}

const dialog = document.getElementById('screenshot-dialog');
const fullImage = document.getElementById('screenshot-full');
const imageViewport = document.querySelector('.image-viewport');
const zoomButton = document.getElementById('image-zoom');
let imageTrigger;
function resetZoom() {
  imageViewport.classList.remove('is-original');
  zoomButton.setAttribute('aria-pressed', 'false');
  zoomButton.textContent = '原寸で見る';
  imageViewport.scrollTo(0, 0);
}
document.querySelectorAll('[data-screen-title]').forEach(link => {
  link.addEventListener('click', event => {
    if (!dialog?.showModal || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    imageTrigger = link;
    fullImage.src = link.href;
    fullImage.alt = link.querySelector('img')?.alt || link.dataset.screenTitle;
    document.getElementById('screenshot-title').textContent = link.dataset.screenTitle;
    resetZoom();
    dialog.showModal();
    document.body.classList.add('dialog-open');
    dialog.scrollTop = 0;
  });
});
zoomButton?.addEventListener('click', () => {
  const original = imageViewport.classList.toggle('is-original');
  zoomButton.setAttribute('aria-pressed', String(original));
  zoomButton.textContent = original ? '画面に合わせる' : '原寸で見る';
  imageViewport.scrollTo(0, 0);
});
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  imageTrigger?.focus({ preventScroll: true });
  resetZoom();
});
