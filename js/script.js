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

        // Append a loading message and get its reference
        const loadingMessageElement = appendMessage('Thinking...', 'bot-message');

        fetch('https://my-portfolio-chatbot-backend.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => {
            if (!response.ok) {
                // If response is not OK (e.g., 400, 500), parse error from body
                return response.json().then(err => { throw new Error(err.error || 'Server error'); });
            }
            return response.json();
        })
        .then(data => {
            // Update the loading message with the actual reply
            if (data.reply) {
                loadingMessageElement.textContent = data.reply;
            } else if (data.error) {
                loadingMessageElement.textContent = `Error: ${data.error}`;
                loadingMessageElement.classList.add('error'); // Add an error class for styling
            }
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom after update
        })
        .catch(error => {
            // Update the loading message with an error message
            loadingMessageElement.textContent = 'Sorry, something went wrong. Please try again later.';
            loadingMessageElement.classList.add('error'); // Add an error class for styling
            console.error('Error sending message:', error);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom after update
        });
    }

    function appendMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
        return messageElement; // Return the element for potential removal (like loading message)
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