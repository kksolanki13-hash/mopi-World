/* ==========================================================================
   MOPi World - Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Photo Switcher (Slideshow) Logic
  // ==========================================
  const slides = document.querySelectorAll('.photo-switcher-slide');
  const dots = document.querySelectorAll('.switcher-dot');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 5000; // 5 seconds per slide

  function showSlide(index) {
    // Wrap around index
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }

    // Update active class on slides
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update active class on dots
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Event Listeners for arrows
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });
  }

  // Event Listeners for dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      showSlide(index);
      resetInterval();
    });
  });

  // Auto Rotation Timer
  function startInterval() {
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  // Start slideshow rotation if slides exist
  if (slides.length > 0) {
    startInterval();
  }


  // ==========================================
  // 2. Wallet Connection Simulator
  // ==========================================
  const walletBtn = document.getElementById('wallet-btn');
  const walletModal = document.getElementById('wallet-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const walletOptions = document.querySelector('.wallet-options');
  const walletLoader = document.getElementById('wallet-loader');
  const walletSuccess = document.getElementById('wallet-success');
  const walletOptionBtns = document.querySelectorAll('.wallet-option-btn');
  const connectedAddrEl = document.getElementById('connected-addr');
  
  let isConnected = false;

  function openWalletModal() {
    if (isConnected) {
      // If already connected, clicking does a mock disconnect
      disconnectWallet();
      return;
    }
    // Reset modal state
    walletOptions.style.display = 'flex';
    walletLoader.style.display = 'none';
    walletSuccess.style.display = 'none';
    walletModal.classList.add('active');
  }

  function closeWalletModal() {
    walletModal.classList.remove('active');
  }

  function disconnectWallet() {
    isConnected = false;
    walletBtn.innerHTML = '<i class="fa-solid fa-wallet"></i> Connect Wallet';
    walletBtn.style.background = '';
    walletBtn.style.boxShadow = '';
    showNotification('Wallet disconnected.', 'info');
  }

  // Open modal click
  if (walletBtn) {
    walletBtn.addEventListener('click', openWalletModal);
  }

  // Close modal click
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeWalletModal);
  }

  // Close when clicking background overlay
  if (walletModal) {
    walletModal.addEventListener('click', (e) => {
      if (e.target === walletModal) {
        closeWalletModal();
      }
    });
  }

  // Wallet Provider click handlers (simulation)
  walletOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const walletName = btn.getAttribute('data-wallet');
      
      // 1. Transition to loading state
      walletOptions.style.display = 'none';
      walletLoader.style.display = 'block';

      // 2. Simulate blockchain handshake/signing delay (1.5s)
      setTimeout(() => {
        let address = '';
        if (walletName === 'metamask') {
          address = '0x7a3E...d3e9';
        } else if (walletName === 'phantom') {
          address = 'B7sF...9z2K';
        } else {
          address = '0x99Fa...821c';
        }

        // Show Success screen in modal
        walletLoader.style.display = 'none';
        walletSuccess.style.display = 'block';
        if (connectedAddrEl) {
          connectedAddrEl.textContent = address;
        }

        // Update the main header connection button
        isConnected = true;
        walletBtn.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #00ff66;"></i> ${address}`;
        walletBtn.style.background = 'rgba(0, 255, 102, 0.08)';
        walletBtn.style.border = '1px solid #00ff66';
        walletBtn.style.boxShadow = '0 0 15px rgba(0, 255, 102, 0.2)';
        
        showNotification(`Successfully connected to ${walletName.charAt(0).toUpperCase() + walletName.slice(1)}!`, 'success');

        // Automatically close modal after 1.5s success showcase
        setTimeout(() => {
          closeWalletModal();
        }, 1500);

      }, 1500);
    });
  });


  // ==========================================
  // 3. Play Now Interaction
  // ==========================================
  const playBtn = document.getElementById('hero-play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!isConnected) {
        // Prompt to connect wallet first
        openWalletModal();
        showNotification('Please connect your Web3 wallet to enter MOPi World.', 'warning');
      } else {
        showNotification('Launching MOPi World Game Simulator... Entering accelerated time!', 'success');
      }
    });
  }


  // ==========================================
  // 4. Custom Notifications Utility
  // ==========================================
  function showNotification(message, type = 'info') {
    // Remove existing notifications if any
    const existing = document.querySelector('.mopi-notification');
    if (existing) {
      existing.remove();
    }

    // Create container
    const notif = document.createElement('div');
    notif.className = `mopi-notification mopi-notif-${type}`;
    
    // Choose icon
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notif.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    // Apply styles directly or via class
    Object.assign(notif.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: 'rgba(7, 9, 14, 0.95)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${type === 'success' ? '#00ff66' : type === 'warning' ? '#ffb700' : '#00f0ff'}`,
      boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 15px ${type === 'success' ? 'rgba(0,255,102,0.15)' : type === 'warning' ? 'rgba(255,183,0,0.15)' : 'rgba(0,240,255,0.15)'}`,
      color: '#fff',
      padding: '16px 20px',
      borderRadius: '8px',
      display: 'flex',
      align-items: center,
      gap: '12px',
      zIndex: '9999',
      fontSize: '0.92rem',
      fontFamily: 'Inter, sans-serif',
      fontWeight: '500',
      animation: 'notifSlideIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      transition: 'opacity 0.3s ease'
    });

    // Append to body
    document.body.appendChild(notif);

    // Slide-in Animation Style Injection
    if (!document.getElementById('notif-style-helper')) {
      const style = document.createElement('style');
      style.id = 'notif-style-helper';
      style.textContent = `
        @keyframes notifSlideIn {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      notif.style.opacity = '0';
      setTimeout(() => {
        notif.remove();
      }, 300);
    }, 4000);
  }

});
