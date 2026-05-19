(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bx-menu');
    mobileNavToggleBtn.classList.toggle('bx-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Accordion Functionality
   */
  document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const targetId = button.getAttribute('data-bs-target');
      const target = document.querySelector(targetId);
      
      // Close all other items in the same accordion
      const parent = button.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-button').forEach(otherButton => {
          if (otherButton !== button) {
            otherButton.setAttribute('aria-expanded', 'false');
            otherButton.classList.add('collapsed');
            const otherTargetId = otherButton.getAttribute('data-bs-target');
            const otherTarget = document.querySelector(otherTargetId);
            if (otherTarget) {
              otherTarget.classList.remove('show');
            }
          }
        });
      }

      // Toggle current item
      button.setAttribute('aria-expanded', !expanded);
      button.classList.toggle('collapsed');
      if (target) {
        target.classList.toggle('show');
      }
    });
  });

  /**
   * Portfolio Filter (Simple JS implementation replacing Isotope)
   */
  const portfolioFilters = document.querySelectorAll('.portfolio-filters li');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (portfolioFilters.length > 0) {
    portfolioFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        // Remove active class from all filters
        portfolioFilters.forEach(f => f.classList.remove('filter-active'));
        // Add active class to clicked filter
        this.classList.add('filter-active');

        const filterValue = this.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
            item.style.display = 'block';
            // Trigger AOS refresh if needed, or simple fade in
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transition = 'opacity 0.5s ease';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
        
        // Re-trigger AOS
        if (typeof AOS !== 'undefined') {
          setTimeout(() => {
             AOS.refresh();
          }, 100);
        }
      });
    });
  }

  /**
   * Custom Modals (Dialog Native)
   */
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && modal.showModal) {
      modal.showModal();
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && modal.close) {
      modal.close();
      document.body.style.overflow = 'auto';
    }
  };

  window.addEventListener('click', function(event) {
    if (event.target.tagName === 'DIALOG') {
      const rect = event.target.getBoundingClientRect();
      const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        closeModal(event.target.id);
      }
    }
  });

  /**
   * Image Zoom Functionality
   */
  document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on a page with project images
    const projectImages = document.querySelectorAll('img.img-fluid');
    let hasZoomableImages = false;
    
    projectImages.forEach(img => {
      const src = img.getAttribute('src') || img.src;
      if(src.includes('/AP/') || src.includes('/stage1/') || src.includes('/stage2/')) {
        hasZoomableImages = true;
      }
    });

    if(!hasZoomableImages) return;

    // Create zoom dialog
    const dialogHtml = `
      <dialog id="image-zoom-dialog" class="custom-dialog" style="max-width: 100vw; max-height: 100vh; background: transparent; border: none; padding: 0; margin: auto; outline: none; overflow: hidden;">
        <div style="position: relative; display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh;">
          <span class="zoom-close" style="position: absolute; top: 20px; right: 40px; font-size: 50px; color: white; cursor: pointer; z-index: 1001; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">&times;</span>
          <img id="zoomed-image" src="" alt="Zoom" style="max-width: 95vw; max-height: 95vh; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); object-fit: contain;">
        </div>
      </dialog>
    `;
    document.body.insertAdjacentHTML('beforeend', dialogHtml);
    
    const dialog = document.getElementById('image-zoom-dialog');
    const zoomedImage = document.getElementById('zoomed-image');
    const closeBtn = dialog.querySelector('.zoom-close');

    if(closeBtn) closeBtn.addEventListener('click', () => dialog.close());
    if(dialog) dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.tagName === 'DIV') dialog.close();
    });

    projectImages.forEach(img => {
      const src = img.getAttribute('src') || img.src;
      if(!(src.includes('/AP/') || src.includes('/stage1/') || src.includes('/stage2/'))) return;

      const isFullWidth = img.style.width === '100%' || img.classList.contains('w-100');
      
      const wrapper = document.createElement('div');
      wrapper.className = 'image-zoom-wrapper';
      wrapper.style.position = 'relative';
      wrapper.style.display = isFullWidth ? 'block' : 'inline-block';
      if (isFullWidth) wrapper.style.width = '100%';
      wrapper.style.maxWidth = '100%';
      wrapper.style.cursor = 'zoom-in';
      
      const borderRadius = window.getComputedStyle(img).borderRadius;
      wrapper.style.borderRadius = borderRadius;
      
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      
      const overlay = document.createElement('div');
      overlay.className = 'image-zoom-overlay';
      overlay.innerHTML = '<i class="bx bx-zoom-in"></i>';
      wrapper.appendChild(overlay);

      wrapper.addEventListener('click', () => {
        zoomedImage.src = img.src;
        if(dialog.showModal) {
            dialog.showModal();
        }
      });
    });
  });

})();
