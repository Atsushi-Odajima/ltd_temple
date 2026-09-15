// The site uses native links and disclosure controls; no personal data is collected.
document.querySelectorAll('details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('details').forEach(other => { if (other !== detail) other.open = false; });
  });
});

const screenshotDialog = document.getElementById('screenshot-dialog');
document.querySelectorAll('[data-screen-title]').forEach(link => {
  link.addEventListener('click', event => {
    if (!screenshotDialog?.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const title = link.dataset.screenTitle;
    const image = document.getElementById('screenshot-full');
    image.src = link.getAttribute('href');
    image.alt = title;
    const sourceImage = link.querySelector('img');
    screenshotDialog.classList.toggle('landscape-dialog', sourceImage ? sourceImage.width > sourceImage.height : title.includes('Wire Pay'));
    document.getElementById('screenshot-title').textContent = title;
    screenshotDialog.showModal();
    screenshotDialog.scrollTop = 0;
  });
});
screenshotDialog?.addEventListener('click', event => {
  if (event.target !== screenshotDialog) return;
  const bounds = screenshotDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) screenshotDialog.close();
});
