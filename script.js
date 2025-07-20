// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Highlight current page in sidebar navigation
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Subtle background color change on scroll
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollPosition / maxScroll;
    
    // Calculate a very subtle background color change
    // Using a barely noticeable shift to pastel green
    const hue = 120; // Green hue
    const saturation = 5 + Math.round(scrollFraction * 5); // Very light saturation
    const lightness = 98 - Math.round(scrollFraction * 2); // Very light, getting slightly darker
    
    document.body.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
  
  // Animation override for hover effects after initial animations complete
  setTimeout(() => {
    const items = document.querySelectorAll('.experience-item, .company-experience, .about-section, .learning-item, .opensource-item, .book-item, .writing-item');
    items.forEach(item => {
      item.style.transition = 'transform var(--transition-medium)';
    });
  }, 2000);
  
  // Mobile dropdown menu toggle
  if (window.innerWidth <= 768) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
      });
    });
  }
  
  // Scrollspy functionality for about page
  if (document.querySelector('.scrollspy-nav')) {
    const sections = document.querySelectorAll('h2[id], h3[id]');
    const navLinks = document.querySelectorAll('.scrollspy-nav a');
    const scrollspyNav = document.querySelector('.scrollspy-nav');
    
    window.addEventListener('scroll', () => {
      // Remove the scrolled class functionality
      
      let current = '';
      const scrollPosition = window.scrollY + 100; // Added offset to improve detection
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120; // Increased offset for better highlighting
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
    });
    
    // Smooth scroll to section when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // Improved animation for projects on scroll
  if (document.querySelector('.project-container')) {
    const projectContainers = document.querySelectorAll('.project-container');
    const projectObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once it's visible, stop observing it
          projectObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    projectContainers.forEach((container, index) => {
      // Add slight delay for staggered animation
      setTimeout(() => {
        projectObserver.observe(container);
      }, index * 100);
    });
  }
  
  // Improved animation for learning items and opensource items
  const animatedItems = [...document.querySelectorAll('.learning-item'), 
                         ...document.querySelectorAll('.opensource-item'),
                         ...document.querySelectorAll('.writing-item'),
                         ...document.querySelectorAll('.book-item')];
  if (animatedItems.length > 0) {
    const itemObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Reset the animation by removing and re-adding it
          entry.target.style.animation = 'none';
          entry.target.offsetHeight; // Trigger reflow
          entry.target.style.animation = 'slideIn 0.8s ease forwards';
          // Once it's visible, stop observing it
          itemObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedItems.forEach((item, index) => {
      // Add custom delay based on index
      item.style.animationDelay = `${0.1 * (index + 1)}s`;
      itemObserver.observe(item);
    });
  }
  
  // PDF embed click handler for projects page
  if (document.querySelector('.pdf-embed')) {
    const pdfEmbeds = document.querySelectorAll('.pdf-embed');
    pdfEmbeds.forEach(embed => {
      embed.addEventListener('click', () => {
        // This is a placeholder for future PDF embedding functionality
        // You can replace this with actual PDF embedding when you have the files
        // alert('PDF embedding will be activated when you add your research papers.');
      });
    });
  }
});

function toggleCoursework(button) {
  const content = button.nextElementSibling;
  button.classList.toggle('active');
  content.classList.toggle('active');
} 