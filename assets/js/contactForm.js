// ═══════════════════════════════════════════
//   CONTACT FORM MODAL
// ═══════════════════════════════════════════

const ContactForm = (() => {
  let modal = null;
  let isInitialized = false;

  function getModalHTML() {
    return `
      <div class="contact-modal" id="contactModal">
        <div class="contact-modal-overlay" id="modalOverlay"></div>
        <div class="contact-modal-content">
          <button class="contact-modal-close" id="modalClose">✕</button>
          <h2 class="contact-modal-title">Get in Touch</h2>
          <p class="contact-modal-subtitle">Let's create something amazing together</p>
          
          <form class="contact-form" id="contactForm">
            <div class="form-group">
              <label for="userName">Your Name</label>
              <input type="text" id="userName" name="user_name" required placeholder="John Doe">
            </div>
            
            <div class="form-group">
              <label for="userEmail">Your Email</label>
              <input type="email" id="userEmail" name="user_email" required placeholder="john@example.com">
            </div>
            
            <div class="form-group">
              <label for="messageSubject">Subject</label>
              <input type="text" id="messageSubject" name="subject" required placeholder="Project Inquiry">
            </div>
            
            <div class="form-group">
              <label for="userMessage">Message</label>
              <textarea id="userMessage" name="message" required rows="5" placeholder="Tell me about your project..."></textarea>
            </div>
            
            <div class="form-status" id="formStatus"></div>
            
            <button type="submit" class="contact-submit" id="submitBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Send Message
            </button>
          </form>
        </div>
      </div>
    `;
  }

  function init() {
    if (isInitialized) return;

    // Insert modal HTML into body
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = getModalHTML();
    document.body.appendChild(modalDiv.firstElementChild);

    // Cache modal elements
    modal = document.getElementById('contactModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    // Event listeners
    modalClose.addEventListener('click', close);
    modalOverlay.addEventListener('click', close);
    contactForm.addEventListener('submit', handleSubmit);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        close();
      }
    });

    // Attach click handlers to all contact triggers
    attachTriggers();

    isInitialized = true;
  }

  function attachTriggers() {
    document.querySelectorAll('.contact-trigger, [href*="mailto:"]').forEach(element => {
      // Skip if already has listener
      if (element.dataset.contactListenerAdded) return;
      
      element.addEventListener('click', (e) => {
        e.preventDefault();
        open();
      });
      
      element.dataset.contactListenerAdded = 'true';
    });
  }

  function open() {
    if (!modal) init();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('user_name'),
      email: formData.get('user_email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
    formStatus.className = 'form-status';
    formStatus.textContent = '';
    
    try {
      const response = await fetch('https://formspree.io/f/mlgpdyrb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        formStatus.className = 'form-status success';
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        contactForm.reset();
        setTimeout(() => {
          close();
          formStatus.textContent = '';
        }, 3000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      // Fallback to mailto if service fails
      const mailtoLink = `mailto:jellyannekaymallari@email.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`)}`;
      window.location.href = mailtoLink;
      
      formStatus.className = 'form-status error';
      formStatus.textContent = '⚠ Opening your email client as fallback...';
      setTimeout(close, 2000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        Send Message
      `;
    }
  }

  return {
    init,
    open,
    close,
    attachTriggers
  };
})();

export default ContactForm;
