document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Cursor Trail Animation
    const cursorTrail = document.createElement('div');
    cursorTrail.classList.add('cursor-trail');
    document.body.appendChild(cursorTrail);

    document.addEventListener('mousemove', (e) => {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        cursorTrail.appendChild(dot);

        // Remove dots after animation
        dot.addEventListener('animationend', () => {
            dot.remove();
        });
    });

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');

    mobileMenu.addEventListener('click', () => {
        nav.querySelector('ul').classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.querySelector('ul').classList.remove('active');
        });
    });

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMinimize = document.getElementById('chatbot-minimize');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInputField = document.getElementById('chatbot-input-field');
    const chatbotSendButton = document.getElementById('chatbot-send');

    let isOpen = false;
    let isMinimized = false;

    chatbotToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            chatbotWindow.style.display = 'block';
            isMinimized = false;
            chatbotBody.style.display = 'block';
        } else {
            chatbotWindow.style.display = 'none';
        }
    });

    chatbotClose.addEventListener('click', () => {
        isOpen = false;
        chatbotWindow.style.display = 'none';
    });

    chatbotMinimize.addEventListener('click', () => {
        isMinimized = !isMinimized;
        chatbotBody.style.display = isMinimized ? 'none' : 'block';
    });

    chatbotSendButton.addEventListener('click', sendMessage);
    chatbotInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = chatbotInputField.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user');
        chatbotInputField.value = '';
        showTypingIndicator();

        // Simulate AI response
        setTimeout(() => {
            hideTypingIndicator();
            appendMessage('Thanks for your message! This is a demo response from your AI assistant.', 'bot');
        }, 1500);
    }

    function appendMessage(text, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const icon = document.createElement('svg');
        icon.className = 'message-icon';
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.innerHTML = type === 'user' ? 
            '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>' :
            '<path d="M12 8V4H8"></path><rect x="4" y="12" width="16" height="8" rx="2"></rect><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M12 18v-2"></path><path d="M12 12v-2"></path>';

        const p = document.createElement('p');
        p.textContent = text;

        messageContent.appendChild(icon);
        messageContent.appendChild(p);
        messageElement.appendChild(messageContent);
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <svg class="message-icon" viewBox="0 0 24 24"><path d="M12 8V4H8"></path><rect x="4" y="12" width="16" height="8" rx="2"></rect><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M12 18v-2"></path><path d="M12 12v-2"></path></svg>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

});

// Add a class to sections for scroll animation
const style = document.createElement('style');
style.innerHTML = `
    section {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }

    section.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);