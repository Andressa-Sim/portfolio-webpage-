document.addEventListener('DOMContentLoaded', () => {
  const typedTextElement = document.querySelector('.typed-text');
  const scrollTop = document.querySelector('.scroll-top');
  const typedItems = ['Desenvolvedora Web', 'Analista de Dados', 'Estudante de Sistemas de Informação'];
  let currentIndex = 0;
  let currentChar = 0;
  let isDeleting = false;
  let typeDelay = 120;

  function type() {
    const currentText = typedItems[currentIndex];
    if (isDeleting) {
      currentChar -= 1;
    } else {
      currentChar += 1;
    }

    typedTextElement.textContent = currentText.substring(0, currentChar);

    if (!isDeleting && currentChar === currentText.length) {
      isDeleting = true;
      typeDelay = 1200;
    } else if (isDeleting && currentChar === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % typedItems.length;
      typeDelay = 200;
    } else {
      typeDelay = isDeleting ? 60 : 120;
    }

    setTimeout(type, typeDelay);
  }

  if (typedTextElement) {
    type();
  }

  const modal = document.getElementById('project-modal');
  const closeModalButton = modal.querySelector('.modal-close');
  const modalTitle = modal.querySelector('#project-modal-title');
  const modalDescription = modal.querySelector('.modal-description');
  const modalList = modal.querySelector('.modal-list');
  const modalGithub = modal.querySelector('.modal-github');

  function toggleModal(open) {
    modal.classList.toggle('active', open);
    modal.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      closeModalButton.focus();
    }
  }

  function populateModal(projectCard) {
    const title = projectCard.dataset.title || 'Projeto';
    const description = projectCard.dataset.description || '';
    const features = projectCard.dataset.features ? projectCard.dataset.features.split(';') : [];
    const github = projectCard.dataset.github || '#';

    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalList.innerHTML = '';

    features.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.textContent = item.trim();
      modalList.appendChild(listItem);
    });

    modalGithub.href = github;
    modalGithub.textContent = `Ver no GitHub de ${title}`;
  }

  document.querySelectorAll('.project-detail-button').forEach((button) => {
    button.addEventListener('click', () => {
      const projectCard = button.closest('.project-item');
      if (!projectCard) return;
      populateModal(projectCard);
      toggleModal(true);
    });
  });

  closeModalButton.addEventListener('click', () => toggleModal(false));

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      toggleModal(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      toggleModal(false);
    }
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }
  });

  if (scrollTop) {
    scrollTop.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});