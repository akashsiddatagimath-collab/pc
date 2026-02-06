// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Header scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll for buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Submission - Sends via WhatsApp
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // Create WhatsApp message with form data
        const whatsappMessage = encodeURIComponent(
            `*New Inquiry - Patil Construction*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}

*Message:*
${message}`
        );

        // Reset form first
        contactForm.reset();

        // Show Grand Welcome Popup - WhatsApp will open when user clicks "Got it!"
        showWelcomePopup(name, whatsappMessage);
    });
}

// Grand Welcome Popup Function
function showWelcomePopup(name, whatsappMessage) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'welcomeOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;

    // Create popup content
    overlay.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            color: white;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            animation: slideUp 0.5s ease;
            border: 2px solid #c9a227;
        ">
            <div style="font-size: 60px; margin-bottom: 20px;">😊🏗️✨</div>
            <h2 style="color: #c9a227; font-size: 28px; margin-bottom: 15px;">
                Thank You! 😊
            </h2>
            <p style="font-size: 18px; line-height: 1.6; margin-bottom: 15px; color: #ddd;">
                Welcome to <strong style="color: #c9a227;">Patil Construction & Interior!</strong>
            </p>
            <p style="font-size: 16px; color: #aaa; margin-bottom: 15px;">
                We're so glad to hear from you. Our team has received your message and will get in touch with you soon to understand your ideas better.
            </p>
            <p style="font-size: 16px; color: #aaa; margin-bottom: 25px;">
                We're excited to work with you and help bring your dream space to life!
            </p>
            <button id="gotItBtn" style="
                background: linear-gradient(135deg, #c9a227, #e8c547);
                color: #1a1a2e;
                border: none;
                padding: 15px 40px;
                font-size: 16px;
                font-weight: bold;
                border-radius: 30px;
                cursor: pointer;
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Got it! 👍
            </button>
        </div>
    `;

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(overlay);

    // Add click handler for Got it button - opens WhatsApp and closes popup
    document.getElementById('gotItBtn').addEventListener('click', () => {
        document.getElementById('welcomeOverlay').remove();
        window.open(`https://wa.me/919632150834?text=${whatsappMessage}`, '_blank');
    });
}
