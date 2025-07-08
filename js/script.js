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
        nav.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInputField = document.getElementById('chatbot-input-field');
    const chatbotSendButton = document.getElementById('chatbot-send');

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('open');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('open');
    });

    chatbotSendButton.addEventListener('click', () => {
        sendMessage();
    });

    chatbotInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatbotInputField.value.trim();
        if (userMessage === '') return;

        appendMessage(userMessage, 'user-message');
        chatbotInputField.value = '';

        // Make API call to your backend
        fetch('https://my-portfolio-chatbot-backend.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            loadingMessageElement.remove(); // Remove loading message
            if (data.reply) {
                appendMessage(data.reply, 'bot-message');
            } else if (data.error) {
                appendMessage(`Error: ${data.error}`, 'bot-message error');
            }
        })
        .catch(error => {
            loadingMessageElement.remove(); // Remove loading message
            console.error('Error sending message:', error);
            appendMessage('Sorry, something went wrong. Please try again later.', 'bot-message error');
        });
    }

    function appendMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
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