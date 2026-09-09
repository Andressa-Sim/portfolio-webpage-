(() => {
  try {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const validSavedTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null;
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = validSavedTheme || preferredTheme;
  } catch {
    document.documentElement.dataset.theme = 'light';
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('.main-nav');
  const scrollTop = document.querySelector('.scroll-top');
  const modal = document.getElementById('project-modal');
  const themeToggle = document.querySelector('.theme-toggle');
  const contactForm = document.getElementById('contact-form');
  let lastFocusedElement = null;

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = theme;

    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      const label = themeToggle.querySelector('.theme-label');
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
      if (icon) icon.textContent = isDark ? '☀️' : '🌙';
      if (label) label.textContent = isDark ? 'Modo claro' : 'Modo escuro';
    }
  }

  const currentTheme = document.documentElement.dataset.theme || 'light';
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);

      try {
        localStorage.setItem('portfolio-theme', nextTheme);
      } catch {
        // O tema continua funcionando mesmo se o armazenamento estiver indisponível.
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const subject = String(formData.get('subject') || '').trim();
      const message = String(formData.get('message') || '').trim();
      const emailSubject = encodeURIComponent(`${subject} — contato de ${name}`);
      const emailBody = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`);

      window.location.href = `mailto:andressaasimao@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    });
  }

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
        try {
          const githubUrl = new URL(card.dataset.github || '');
          const isSafeGithubUrl = githubUrl.protocol === 'https:' && githubUrl.hostname === 'github.com';
          githubLink.hidden = !isSafeGithubUrl;
          if (isSafeGithubUrl) githubLink.href = githubUrl.href;
        } catch {
          githubLink.hidden = true;
        }
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
