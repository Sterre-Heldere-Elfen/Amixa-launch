const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const yearEl = document.getElementById('year');
const profileForm = document.getElementById('profile-form');
const contrastToggle = document.querySelector('.contrast-toggle');
const devModal = document.getElementById('devModal');
const closeDevModal = document.getElementById('closeDevModal');

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

const firebaseIsConfigured = Object.values(firebaseConfig).every(
  (value) => value && !value.startsWith('YOUR_')
);

if (window.firebase && firebaseIsConfigured && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = window.firebase && firebaseIsConfigured ? firebase.firestore() : null;

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (contrastToggle) {
  const storedPreference = localStorage.getItem('amixa-high-contrast');

  if (storedPreference === 'true') {
    document.body.classList.add('high-contrast');
    contrastToggle.setAttribute('aria-pressed', 'true');
  }

  contrastToggle.addEventListener('click', () => {
    const isActive = document.body.classList.toggle('high-contrast');
    localStorage.setItem('amixa-high-contrast', String(isActive));
    contrastToggle.setAttribute('aria-pressed', String(isActive));
  });
}

if (devModal && closeDevModal) {
  closeDevModal.addEventListener('click', () => {
    devModal.classList.add('hidden');
  });
}

if (profileForm) {
  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (devModal) {
      devModal.classList.remove('hidden');
    }

    const successMessage = profileForm.querySelector('.form-success');
    if (successMessage) {
      successMessage.textContent = '';
    }

    return;
  });
}

const rotatorSlides = Array.from(document.querySelectorAll('.quote-rotator__slide'));

if (rotatorSlides.length > 1) {
  let activeIndex = 0;

  setInterval(() => {
    activeIndex = (activeIndex + 1) % rotatorSlides.length;

    rotatorSlides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
    });
  }, 3000);
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
