/* ==========================================================================
   FutureNxt AIverse - Apptad Enterprise JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initApptadSlider();
  initVideoPopupModal();
  initSmartVideoPlayback();
  initCounters();
  initAjaxForms();
});

/* 1. Header Scroll Effect */
function initNavbar() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

/* 2. Apptad Hero Carousel (.home-slider) */
function initApptadSlider() {
  const slides = document.querySelectorAll('.home-slider__slide');
  const bars = document.querySelectorAll('.home-slider__bar');
  const counterEl = document.getElementById('sliderCurrentNum');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');

  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;
  const slideDuration = 4500; // 4.5 seconds per slide

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      const vid = slide.querySelector('video');
      if (vid) {
        if (i === index) vid.play().catch(() => {});
        else vid.pause();
      }
    });

    bars.forEach((bar, i) => {
      bar.classList.toggle('is-active', i === index);
    });

    if (counterEl) {
      counterEl.textContent = String(index + 1).padStart(2, '0');
    }

    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(nextSlide, slideDuration);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  bars.forEach((bar, i) => {
    bar.addEventListener('click', () => {
      goToSlide(i);
      startAutoplay();
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoplay();
    }
  });

  startAutoplay();
}

/* 3. Video Lightbox Popup Modal */
function initVideoPopupModal() {
  const modal = document.getElementById('videoPopupModal');
  const player = document.getElementById('popupVideoPlayer');
  const closeBtn = document.getElementById('closeVideoModalBtn');
  const triggers = document.querySelectorAll('.trigger-video-modal');

  if (!modal || !player) return;

  function openModal() {
    modal.classList.add('is-open');
    player.currentTime = 0;
    player.play().catch(() => {});
  }

  function closeModal() {
    modal.classList.remove('is-open');
    player.pause();
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* 4. Smart Video Playback:
   - Jaise hi user video wale part par pahuchta hai -> Video automatically ON ho jati hai (sound ke saath).
   - User scroll karke video se bahar nikalta hai -> Video automatically BAND (pause) ho jati hai.
   - User click kare to sound turant play hoti hai (browser policy compliant).
   - Full manual play/pause/sound toggle controls available.
*/
function initSmartVideoPlayback() {
  const inViewVideos = document.querySelectorAll('.in-view-autoplay-video');
  const popupModal = document.getElementById('videoPopupModal');
  const popupPlayer = document.getElementById('popupVideoPlayer');

  if (!inViewVideos.length) return;

  let userInteracted = false;

  function updateSoundUI(video, isMuted) {
    const card = video.closest('.video-inline-card') || video.closest('.video-frame-card');
    if (!card) return;
    const btn = card.querySelector('.btn-sound-toggle');
    if (!btn) return;

    const iconMuted = btn.querySelector('.icon-muted');
    const iconUnmuted = btn.querySelector('.icon-unmuted');
    const label = btn.querySelector('.sound-label');

    if (isMuted) {
      btn.classList.remove('is-unmuted');
      if (iconMuted) iconMuted.style.display = 'inline-block';
      if (iconUnmuted) iconUnmuted.style.display = 'none';
      if (label) label.textContent = 'Click for Sound 🔊';
    } else {
      btn.classList.add('is-unmuted');
      if (iconMuted) iconMuted.style.display = 'none';
      if (iconUnmuted) iconUnmuted.style.display = 'inline-block';
      if (label) label.textContent = 'Sound ON 🔊';
    }
  }

  function unmuteAndPlayWithSound(video) {
    video.muted = false;
    video.volume = 1.0;
    updateSoundUI(video, false);
    if (video.paused) {
      video.play().catch(() => {});
    }
  }

  // Any user gesture on the webpage unlocks sound everywhere
  function unlockAudioGlobally() {
    userInteracted = true;
    inViewVideos.forEach(video => {
      const rect = video.getBoundingClientRect();
      const isVisible = rect.top < (window.innerHeight - 60) && rect.bottom > 60;
      if (isVisible) {
        unmuteAndPlayWithSound(video);
      }
    });
  }

  ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
    document.addEventListener(evt, unlockAudioGlobally, { passive: true });
  });

  // Play video with audio when reached
  function playVideoInView(video) {
    if (userInteracted) {
      video.muted = false;
      video.volume = 1.0;
      video.play().then(() => {
        updateSoundUI(video, false);
      }).catch(() => {
        video.muted = true;
        video.play().catch(() => {});
        updateSoundUI(video, true);
      });
    } else {
      // Try unmuted first
      video.muted = false;
      video.volume = 1.0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updateSoundUI(video, false);
        }).catch(() => {
          // If browser restricts unmuted autoplay before first click, play muted and prompt
          video.muted = true;
          video.play().catch(() => {});
          updateSoundUI(video, true);
        });
      }
    }
  }

  // Intersection Observer to detect when user reaches video part
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      // User reaches video part (at least 30% in view)
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        playVideoInView(video);
      } else {
        // User scrolls away from video part -> Pause video automatically
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, {
    threshold: [0, 0.2, 0.3, 0.5, 0.8]
  });

  inViewVideos.forEach(video => {
    observer.observe(video);

    // Clicking directly on video unmutes and plays with sound
    video.addEventListener('click', () => {
      userInteracted = true;
      if (video.muted) {
        unmuteAndPlayWithSound(video);
      }
    });

    // Native player volume/mute events update UI pill
    video.addEventListener('volumechange', () => {
      updateSoundUI(video, video.muted);
    });
  });

  // Sound toggle button click
  document.querySelectorAll('.btn-sound-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      userInteracted = true;
      const container = btn.closest('.video-inline-card') || btn.closest('.video-frame-card');
      const video = container ? container.querySelector('video') : null;
      if (!video) return;

      if (video.muted) {
        unmuteAndPlayWithSound(video);
      } else {
        video.muted = true;
        updateSoundUI(video, true);
      }
    });
  });

  // Window scroll listener: as soon as user scrolls away from the video section, pause immediately
  window.addEventListener('scroll', () => {
    inViewVideos.forEach(video => {
      const rect = video.getBoundingClientRect();
      const isVisible = rect.top < (window.innerHeight - 60) && rect.bottom > 60;
      if (!isVisible && !video.paused) {
        video.pause();
      }
    });

    // If video popup modal is open and user scrolls, close and pause
    if (popupModal && popupModal.classList.contains('is-open')) {
      popupModal.classList.remove('is-open');
      if (popupPlayer) popupPlayer.pause();
    }
  }, { passive: true });
}

/* 5. Number Counter Animation */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        let count = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
          count += step;
          if (count >= target) {
            el.innerHTML = target + '<span>+</span>';
            clearInterval(interval);
          } else {
            el.innerHTML = count + '<span>+</span>';
          }
        }, 25);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* 6. AJAX Form Handling for Hostinger (contact-handler.php) */
function initAjaxForms() {
  const forms = document.querySelectorAll('.ajax-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-submit');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... ⏳';
      }

      try {
        const formData = new FormData(form);
        const action = form.getAttribute('action') || 'contact-handler.php';
        const response = await fetch(action, {
          method: 'POST',
          body: formData
        });

        const data = await response.json().catch(() => ({ status: 'success' }));
        alert(data.message || 'Thank you! Your message has been sent successfully.');
        form.reset();
      } catch (err) {
        alert('Thank you! Your message has been received. Our team will contact you soon.');
        form.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  });
}
