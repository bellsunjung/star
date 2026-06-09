/* ============================================
   Romantic Flower - Mobile Wedding Invitation
   script.js (404 & 문법 에러 완벽 수정본)
   ============================================ */

(function () {
  'use strict';

  /* ── Helpers ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function padZero(n) {
    return String(n).padStart(2, '0');
  }

  /* ── Image Auto-Detection (안정적인 수동 지정 방식으로 교체) ── */
  let galleryImages = [];

  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
        const images = [];
        
        // 💡 [여기 수정!] 본인의 실제 사진 장수를 숫자로 적어주세요.
        const galleryCount = 15; // images/gallery/ 폴더 안의 실제 사진 장수
        const storyCount = 2;    // images/story/ 폴더 안의 실제 사진 장수
        
        const totalPhotos = (folder === 'gallery') ? galleryCount : storyCount;

        // 존재하지 않는 번호는 애초에 호출하지 않아 404 에러를 방지합니다.
        for (let i = 1; i <= totalPhotos; i++) {
            images.push(`images/${folder}/${i}.jpg`);
        }
        
        resolve(images);
    });
  }

  /* ── Meta Tags ── */
  function initMeta() {
    document.title = CONFIG.meta.title;
    const t = $('#og-title');
    const d = $('#og-description');
    const i = $('#og-image');
    if (t) t.setAttribute('content', CONFIG.meta.title);
    if (d) d.setAttribute('content', CONFIG.meta.description);
    if (i) i.setAttribute('content', CONFIG.meta.image);
    
    const pTitle = $('#page-title');
    if (pTitle) pTitle.textContent = CONFIG.meta.title;
  }

  /* ── Curtain/Veil Opening ── */
  function initCurtain() {
    const curtain = $('#curtain');
    if (!curtain) return;

    if (!CONFIG.useCurtain) {
      curtain.style.display = 'none';
      document.body.classList.remove('is-locked');
      return;
    }

    // 데이터 바인딩
    const cTitle = curtain.querySelector('.curtain__title');
    const cNames = curtain.querySelector('.curtain__names');
    const cDate = curtain.querySelector('.curtain__date');

    if (cTitle) cTitle.textContent = CONFIG.curtain.title;
    if (cNames) cNames.textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name}`;
    if (cDate) cDate.textContent = CONFIG.curtain.dateText;

    const btn = $('#curtain-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        curtain.classList.add('is-opened');
        document.body.classList.remove('is-locked');
        setTimeout(() => {
          curtain.style.display = 'none';
        }, 1200);
      });
    }
  }

  /* ── Hero Section ── */
  function initHero() {
    const names = $('.hero__names');
    const title = $('.hero__title');
    const sub = $('.hero__subtitle');
    const date = $('.hero__wedding-date');
    const venue = $('.hero__wedding-venue');

    if (names) names.textContent = `${CONFIG.groom.name} • ${CONFIG.bride.name}`;
    if (title) title.textContent = CONFIG.wedding.title || "WEDDING INVITATION";
    if (sub) sub.textContent = CONFIG.wedding.subtitle || "저희의 결혼식에 초대합니다";
    if (date) {
      date.innerHTML = `${CONFIG.wedding.date} ${CONFIG.wedding.dayOfWeek}<br>${CONFIG.wedding.time}`;
    }
    if (venue) {
      venue.innerHTML = `${CONFIG.wedding.venue} ${CONFIG.wedding.hall}`;
    }
  }

  /* ── Greeting Section ── */
  function initGreeting() {
    const title = $('.greeting__title');
    const content = $('.greeting__content');
    const fGroom = $('#relation-groom');
    const fBride = $('#relation-bride');

    if (title) title.textContent = CONFIG.greeting.title;
    if (content) content.innerHTML = CONFIG.greeting.content.replace(/\n/g, '<br>');

    // 혼주 관계 조립
    if (fGroom) {
      let txt = `${CONFIG.groom.father} • ${CONFIG.groom.mother}의 아들 <span class="highlight">${CONFIG.groom.name}</span>`;
      if (CONFIG.groom.fatherDeceased) txt = txt.replace(CONFIG.groom.father, `故 ${CONFIG.groom.father}`);
      if (CONFIG.groom.motherDeceased) txt = txt.replace(CONFIG.groom.mother, `故 ${CONFIG.groom.mother}`);
      fGroom.innerHTML = txt;
    }

    if (fBride) {
      let txt = `${CONFIG.bride.father} • ${CONFIG.bride.mother}의 딸 <span class="highlight">${CONFIG.bride.name}</span>`;
      if (CONFIG.bride.fatherDeceased) txt = txt.replace(CONFIG.bride.father, `故 ${CONFIG.bride.father}`);
      if (CONFIG.bride.motherDeceased) txt = txt.replace(CONFIG.bride.mother, `故 ${CONFIG.bride.mother}`);
      fBride.innerHTML = txt;
    }
  }

  /* ── Story Section ── */
  async function initStory() {
    const title = $('.story__title');
    const content = $('.story__text');
    if (title) title.textContent = CONFIG.story.title;
    if (content) content.innerHTML = CONFIG.story.content.replace(/\n/g, '<br>');

    const storyImgs = await loadImagesFromFolder('story');
    const grid = $('#story-grid');
    if (!grid || storyImgs.length === 0) return;

    grid.innerHTML = storyImgs
      .map(
        (src) => `
      <div class="story__item">
        <img src="${src}" alt="Our Story" loading="lazy">
      </div>
    `
      )
      .join('');
  }

  /* ── Gallery (오류 없는 안전한 로딩) ── */
  async function initGallery() {
    const grid = $('#gallery-grid');
    if (!grid) return;

    // 이미지 로드 대기
    galleryImages = await loadImagesFromFolder('gallery');

    const skeleton = $('#gallery-loading');
    if (skeleton) skeleton.style.display = 'none';

    if (galleryImages.length === 0) {
      grid.innerHTML = '<p class="gallery__empty">등록된 사진이 없습니다.</p>';
      return;
    }

    grid.innerHTML = galleryImages
      .map(
        (src, idx) => `
      <div class="gallery__item" data-index="${idx}">
        <img src="${src}" alt="Gallery Image ${idx + 1}" loading="lazy">
      </div>
    `
      )
      .join('');

    // 클릭 시 뷰어 열기
    $$('.gallery__item', grid).forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        openViewer(idx);
      });
    });
  }

  /* ── Photo Viewer (화면 밀림 완벽 보정) ── */
  let viewerIdx = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;
  let isSwiping = false;

  function openViewer(index) {
    viewerIdx = index;
    const viewer = $('#viewer');
    const track = $('#viewer-track');
    if (!viewer || !track || galleryImages.length === 0) return;

    // 가로 배열 레이아웃 강제 지정
    track.style.display = 'flex';
    track.style.width = `${galleryImages.length * 100}%`;

    track.innerHTML = galleryImages
      .map(
        (src) => `
      <div class="viewer__slide" style="width: ${100 / galleryImages.length}%; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
        <img src="${src}" alt="" loading="lazy" style="max-width: 100%; max-height: 100vh; object-fit: contain;" />
      </div>
    `
      )
      .join('');

    viewer.classList.add('is-active');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      goToSlide(viewerIdx, false);
    }, 50);
  }

  function closeViewer() {
    const viewer = $('#viewer');
    if (!viewer) return;
    viewer.classList.remove('is-active');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function goToSlide(idx, animate = true) {
    const track = $('#viewer-track');
    const counter = $('#viewer-counter');
    const total = galleryImages.length;
    if (total === 0 || !track) return;
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    viewerIdx = idx;

    const viewWidth = window.innerWidth;

    track.style.transition = animate ? 'transform 0.3s ease' : 'none';
    track.style.transform = `translateX(-${idx * viewWidth}px)`;
    
    if (counter) {
      counter.textContent = `${idx + 1} / ${total}`;
    }
  }

  function initViewer() {
    const viewer = $('#viewer');
    if (!viewer) return;

    $('#viewer-close')?.addEventListener('click', closeViewer);
    viewer.querySelector('.viewer__backdrop')?.addEventListener('click', closeViewer);
    $('#viewer-prev')?.addEventListener('click', () => goToSlide(viewerIdx - 1));
    $('#viewer-next')?.addEventListener('click', () => goToSlide(viewerIdx + 1));

    document.addEventListener('keydown', (e) => {
      if (!viewer.classList.contains('is-active')) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') goToSlide(viewerIdx - 1);
      if (e.key === 'ArrowRight') goToSlide(viewerIdx + 1);
    });

    const track = $('#viewer-track');
    if (!track) return;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
      isSwiping = true;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
      const viewWidth = window.innerWidth;
      const offset = -(viewerIdx * viewWidth) + touchDeltaX;
      track.style.transform = `translateX(${offset}px)`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      const viewWidth = window.innerWidth;
      const threshold = viewWidth * 0.2;
      
      if (touchDeltaX < -threshold) {
        goToSlide(viewerIdx + 1);
      } else if (touchDeltaX > threshold) {
        goToSlide(viewerIdx - 1);
      } else {
        goToSlide(viewerIdx);
      }
    });
  }

  /* ── Calendar & Countdown ── */
  function initCalendar() {
    const title = $('.calendar__title');
    const sub = $('.calendar__subtitle');
    if (title) title.textContent = CONFIG.wedding.dateText || "10월";
    if (sub) sub.textContent = `${CONFIG.wedding.date} ${CONFIG.wedding.dayOfWeek} ${CONFIG.wedding.time}`;

    // 디데이 계산
    const ddayNum = $('#dday-num');
    const ddayTxt = $('#dday-text');
    if (!ddayNum) return;

    const targetStr = `${CONFIG.wedding.dateYmd.replace(/\./g, '-')}T${CONFIG.wedding.time}:00`;
    const target = new Date(targetStr);
    
    function updateCountdown() {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        ddayNum.textContent = "00";
        if (ddayTxt) ddayTxt.textContent = "두 사람의 결혼식이 진행 중이거나 종료되었습니다. ❤️";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      $('#timer-days').textContent = padZero(days);
      $('#timer-hours').textContent = padZero(hours);
      $('#timer-minutes').textContent = padZero(mins);
      $('#timer-seconds').textContent = padZero(secs);
      
      ddayNum.textContent = padZero(days);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ── Map / Directions ── */
  function initMap() {
    const vName = $('.map__venue-name');
    const vHall = $('.map__venue-hall');
    const vAddr = $('.map__address-text');
    const btnKakao = $('#btn-kakao');
    const btnNaver = $('#btn-naver');

    if (vName) vName.textContent = CONFIG.wedding.venue;
    if (vHall) vHall.textContent = CONFIG.wedding.hall;
    if (vAddr) vAddr.textContent = CONFIG.wedding.address;

    if (btnKakao) btnKakao.setAttribute('href', CONFIG.wedding.mapLinks.kakao);
    if (btnNaver) btnNaver.setAttribute('href', CONFIG.wedding.mapLinks.naver);

    // 복사 버튼
    const copyBtn = $('.map__address-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(CONFIG.wedding.address).then(() => {
          alert('주소가 복사되었습니다.');
        }).catch(() => {
          alert('주소 복사에 실패했습니다. 직접 복사해 주세요.');
        });
      });
    }
  }

  /* ── Account Accordion ── */
  function initAccounts() {
    const gBody = $('#acc-groom-body');
    const bBody = $('#acc-bride-body');

    function makeRows(list) {
      if (!list || list.length === 0) return '';
      return list
        .map(
          (acc) => `
        <div class="account__row">
          <div class="account__info">
            <span class="account__role">${acc.role} ${acc.name}</span>
            <span class="account__number">${acc.bank} ${acc.number}</span>
          </div>
          <button class="account__copy-btn" data-num="${acc.bank} ${acc.number}">복사</button>
        </div>
      `
        )
        .join('');
    }

    if (gBody) gBody.innerHTML = makeRows(CONFIG.accounts.groom);
    if (bBody) bBody.innerHTML = makeRows(CONFIG.accounts.bride);

    // 아코디언 열고 닫기 토글
    $$('.accordion__header').forEach((header) => {
      header.addEventListener('click', () => {
        const parent = header.parentElement;
        const isActive = parent.classList.contains('is-active');
        
        $$('.accordion__item').forEach((item) => item.classList.remove('is-active'));
        if (!isActive) {
          parent.classList.add('is-active');
        }
      });
    });

    // 계좌번호 복사 클릭 이벤트
    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('account__copy-btn')) {
        const num = e.target.getAttribute('data-num');
        navigator.clipboard.writeText(num).then(() => {
          alert('계좌번호가 복사되었습니다.');
        });
      }
    });
  }

  /* ── Falling Petals (벚꽃 휘날리기 효과) ── */
  function initPetals() {
    const canvas = $('#petals-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    }

    const PETAL_COUNT = 25;
    const petals = [];

    function createPetal() {
      return {
        x: Math.random() * W,
        y: Math.random() * H - H,
        size: Math.random() * 8 + 6,
        speedX: Math.random() * 1.5 - 0.5,
        speedY: Math.random() * 1.5 + 1,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 1 - 0.5,
      };
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      // 하트/벚꽃잎 모양 그리기
      ctx.fillStyle = 'rgba(245, 230, 224, 0.7)';
      ctx.beginPath();
      const s = p.size;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(s * 0.3, -s * 0.4, s * 0.8, -s * 0.3, s * 0.5, 0);
      ctx.bezierCurveTo(s * 0.8, s * 0.3, s * 0.3, s * 0.4, 0, 0);
      ctx.fill();

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      petals.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > H + 20) {
          p.y = -20;
          p.x = Math.random() * W;
        }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;

        drawPetal(p);
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(createPetal());
    }
    animate();
  }

  /* ── DOM Content Loaded 통합 초기화 ── */
  document.addEventListener('DOMContentLoaded', async () => {
    initMeta();
    initCurtain();
    initHero();
    initGreeting();
    
    // 비동기 갤러리 및 스토리 로딩 수행
    await initStory();
    await initGallery();
    
    initViewer();
    initCalendar();
    initMap();
    initAccounts();
    initPetals();
  });

})();