document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ПЛАВНЫЙ СКРОЛЛ (Lenis) ---
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- 2. ИКОНКИ (Lucide) ---
  if (window.lucide) {
      window.lucide.createIcons();
  }

  // --- 3. МОБИЛЬНОЕ МЕНЮ ---
  const mOpen = document.getElementById('menu-open');
  const mClose = document.getElementById('menu-close');
  const mMenu = document.getElementById('mobile-menu');
  const mLinks = document.querySelectorAll('.mobile-link');

  if (mOpen && mMenu) {
      mOpen.onclick = () => {
          mMenu.classList.add('active');
          document.body.style.overflow = 'hidden';
      };
  }

  if (mClose && mMenu) {
      mClose.onclick = () => {
          mMenu.classList.remove('active');
          document.body.style.overflow = '';
      };
  }

  mLinks.forEach(link => {
      link.onclick = () => {
          if (mMenu) mMenu.classList.remove('active');
          document.body.style.overflow = '';
      };
  });

  // --- 4. GSAP АНИМАЦИИ (Используем forEach для всех карточек) ---
  if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      const allCards = document.querySelectorAll('.bento-card, .benefit-item, .course-card');

      allCards.forEach((card, i) => {
          gsap.from(card, {
              scrollTrigger: {
                  trigger: card,
                  start: 'top 90%',
              },
              y: 40,
              opacity: 0,
              duration: 0.8,
              delay: (i % 3) * 0.15, // Эффект ступенчатого появления
              ease: 'power2.out'
          });
      });

      // Анимация "плавания" окна кода в секции Innovation
      const codeWin = document.querySelector('.code-window');
      if (codeWin) {
          gsap.to(codeWin, {
              y: 15,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
          });
      }
  }

  // --- 5. ФОРМА КОНТАКТОВ (Валидация + Капча + Чекбокс) ---
  const mainForm = document.getElementById('main-form');
  const phoneInput = document.getElementById('phone-input');
  const formMsg = document.getElementById('form-msg');

  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/\D/g, '');
      });
  }

  if (mainForm) {
      mainForm.onsubmit = (e) => {
          e.preventDefault();

          const captchaVal = document.getElementById('captcha-input').value;
          const isAgreed = document.getElementById('policy-agree').checked;

          if (!isAgreed) {
              showStatus("Подтвердите согласие с политикой!", "red");
              return;
          }

          if (parseInt(captchaVal) !== 7) {
              showStatus("Ошибка капчи (4+3=7)", "red");
              return;
          }

          showStatus("Отправка...", "var(--primary)");

          setTimeout(() => {
              mainForm.reset();
              showStatus("Успешно! Мы свяжемся с вами в ближайшее время.", "green");
          }, 1500);
      };
  }

  function showStatus(text, color) {
      if (formMsg) {
          formMsg.innerText = text;
          formMsg.style.color = color;
      }
  }

  // --- 6. COOKIE POPUP (С исправлением SyntaxError) ---
  const cookieContainer = document.getElementById('cookie-bar');
  const cookieConfirmBtn = document.getElementById('cookie-ok');

  if (cookieContainer && !localStorage.getItem('dextra_cookies_accepted')) {
      setTimeout(() => {
          cookieContainer.style.display = 'block';
          gsap.to(cookieContainer, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out"
          });
      }, 2000);

      if (cookieConfirmBtn) {
          cookieConfirmBtn.onclick = () => {
              localStorage.setItem('dextra_cookies_accepted', 'true');
              gsap.to(cookieContainer, {
                  y: 100,
                  opacity: 0,
                  duration: 0.5,
                  onComplete: () => cookieContainer.style.display = 'none'
              });
          };
      }
  }
});