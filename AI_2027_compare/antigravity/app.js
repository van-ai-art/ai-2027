/**
 * AI 2027 시나리오 해설서 - 인터랙티브 스크립트 (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 스크롤 진행률 (Reading Progress Bar)
  const progressBar = document.getElementById('progress-bar');
  const siteHeader = document.getElementById('top-header');

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // 헤더 그림자 효과
    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // 2. 모바일 네비게이션 드로어 토글
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (mobileDrawer.classList.contains('open')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // 모바일 링크 클릭 시 드로어 닫기
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // 3. 결말 탭 인터랙션 (Race vs Slowdown Endings)
  const tabRace = document.getElementById('tab-race');
  const tabSlowdown = document.getElementById('tab-slowdown');
  const contentRace = document.getElementById('content-race');
  const contentSlowdown = document.getElementById('content-slowdown');

  const switchEnding = (target) => {
    if (target === 'race') {
      tabRace.classList.add('active');
      tabSlowdown.classList.remove('active');
      contentRace.classList.add('active');
      contentSlowdown.classList.remove('active');
    } else {
      tabSlowdown.classList.add('active');
      tabRace.classList.remove('active');
      contentSlowdown.classList.add('active');
      contentRace.classList.remove('active');
    }
  };

  if (tabRace && tabSlowdown) {
    tabRace.addEventListener('click', () => switchEnding('race'));
    tabSlowdown.addEventListener('click', () => switchEnding('slowdown'));
  }

  // 타임라인 내의 분기 버튼 클릭 시 해당 결말로 전환 및 스크롤
  const forkBtnRace = document.querySelector('.btn-outline-danger[href="#endings"]');
  const forkBtnSlowdown = document.querySelector('.btn-outline-success[href="#endings"]');

  if (forkBtnRace) {
    forkBtnRace.addEventListener('click', () => {
      switchEnding('race');
    });
  }

  if (forkBtnSlowdown) {
    forkBtnSlowdown.addEventListener('click', () => {
      switchEnding('slowdown');
    });
  }

  // 4. 용어 사전 모달 (Glossary Modal)
  const glossaryBtn = document.getElementById('glossary-btn');
  const glossaryModal = document.getElementById('glossary-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  const openModal = () => {
    if (glossaryModal) {
      glossaryModal.classList.add('open');
      glossaryModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }
  };

  const closeModal = () => {
    if (glossaryModal) {
      glossaryModal.classList.remove('open');
      glossaryModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (glossaryBtn) glossaryBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (glossaryModal) {
    glossaryModal.addEventListener('click', (e) => {
      if (e.target === glossaryModal) {
        closeModal();
      }
    });
  }

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && glossaryModal && glossaryModal.classList.contains('open')) {
      closeModal();
    }
  });

  // 5. 맨 위로 가기 버튼 (Back to top)
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. 스크롤 스파이 (Scrollspy) - 현재 보고 있는 섹션 네비게이션 활성화
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = Array.from(navLinks).map(link => {
    const id = link.getAttribute('href').substring(1);
    return document.getElementById(id);
  }).filter(Boolean);

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // 7. 카드 진입 애니메이션 (Fade-in on scroll)
  const animatedElements = document.querySelectorAll('.summary-card, .timeline-card, .evo-card, .concept-card, .job-category-card, .geo-card, .threat-card, .question-card');
  
  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    fadeObserver.observe(el);
  });
});
