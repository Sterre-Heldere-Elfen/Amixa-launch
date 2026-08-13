const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const yearEl = document.getElementById('year');
const profileForm = document.getElementById('profile-form');
const contrastToggle = document.querySelector('.contrast-toggle');
const devModal = document.getElementById('devModal');
const closeDevModal = document.getElementById('closeDevModal');
const waitlistForm = document.getElementById('waitlist-form');
const waitlistEmailInput = document.getElementById('waitlist-email');
const waitlistSuccess = document.getElementById('waitlist-success');

const WAITLIST_KEY = 'amixa-waitlist';

const saveEmailToWaitlist = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return false;
  }

  const savedEmails = JSON.parse(localStorage.getItem(WAITLIST_KEY) || '[]');
  const uniqueEmails = Array.isArray(savedEmails) ? savedEmails : [];

  if (!uniqueEmails.includes(normalizedEmail)) {
    uniqueEmails.push(normalizedEmail);
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(uniqueEmails));
  }

  return true;
};

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

if (waitlistForm && waitlistEmailInput && waitlistSuccess && devModal) {
  waitlistForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailValue = waitlistEmailInput.value.trim();
    const isSaved = saveEmailToWaitlist(emailValue);

    if (!isSaved) {
      waitlistEmailInput.focus();
      return;
    }

    waitlistSuccess.textContent = 'Bedankt! Je e-mailadres is opgeslagen. We houden je op de hoogte.';
    waitlistForm.reset();

    window.setTimeout(() => {
      devModal.classList.add('hidden');
    }, 1800);
  });
}

if (profileForm) {
  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const emailInput = profileForm.querySelector('input[name="email"]');
    const successMessage = profileForm.querySelector('.form-success');

    if (!emailInput) {
      if (devModal) {
        devModal.classList.remove('hidden');
      }
      return;
    }

    const emailValue = emailInput.value.trim();
    const saved = saveEmailToWaitlist(emailValue);

    if (!saved) {
      emailInput.focus();
      if (successMessage) {
        successMessage.textContent = 'Voer een geldig e-mailadres in.';
      }
      return;
    }

    if (successMessage) {
      successMessage.textContent = 'Bedankt! Je e-mailadres is opgeslagen en we houden je op de hoogte.';
    }

    if (devModal) {
      devModal.classList.remove('hidden');
      if (waitlistEmailInput) {
        waitlistEmailInput.value = emailValue;
      }
    }

    profileForm.reset();
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
