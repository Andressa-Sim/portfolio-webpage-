document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('.main-nav');
  const scrollTop = document.querySelector('.scroll-top');
  const modal = document.getElementById('project-modal');
  let lastFocusedElement = null;

  function closeMenu() {
    if (!menuButton || !navigation) return;
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  if (modal) {
    const closeButton = modal.querySelector('.modal-close');
    const title = modal.querySelector('#project-modal-title');
    const description = modal.querySelector('.modal-description');
    const list = modal.querySelector('.modal-list');
    const githubLink = modal.querySelector('.modal-github');

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    document.querySelectorAll('.project-detail-button').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.project-card');
        if (!card) return;

        lastFocusedElement = button;
        title.textContent = card.dataset.title || 'Projeto';
        description.textContent = card.dataset.description || '';
        githubLink.href = card.dataset.github || '#';
        list.replaceChildren();

        (card.dataset.features || '').split(';').filter(Boolean).forEach((feature) => {
          const item = document.createElement('li');
          item.textContent = feature;
          list.appendChild(item);
        });

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        closeButton.focus();
      });
    });

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  if (scrollTop) {
    function updateScrollButton() {
      scrollTop.classList.toggle('visible', window.scrollY > 500);
    }
    window.addEventListener('scroll', updateScrollButton, { passive: true });
    updateScrollButton();
  }
});
