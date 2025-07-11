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
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
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

        dot.addEventListener('animationend', () => {
            dot.remove();
        });
    });

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');

    if (mobileMenu && nav) {
        mobileMenu.addEventListener('click', () => {
            nav.querySelector('ul').classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.querySelector('ul').classList.contains('active')) {
                nav.querySelector('ul').classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });

    // --- Hanging ID Card Logic ---
    const idCardContainer = document.getElementById('id-card-container');
    const idCard = document.getElementById('id-card');
    const idCardNumber = document.getElementById('id-card-number');
    const validDate = document.getElementById('valid-date');

    if (idCardContainer && idCard && idCardNumber && validDate) {
        idCardNumber.textContent = `#${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        validDate.textContent = expiryDate.toLocaleDateString();

        let isFlipped = false;
        let isDragging = false;
        let startX, startY, initialX = 0, initialY = 0;

        idCard.addEventListener('click', (e) => {
            if (!isDragging) {
                isFlipped = !isFlipped;
                idCard.classList.toggle('flipped');
            }
        });

        idCardContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) {
                const rect = idCardContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = (x - centerX) / 15; 
                const rotateX = (centerY - y) / 15;
                idCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isFlipped ? 'rotateY(180deg)' : ''}`;
            }
        });

        idCardContainer.addEventListener('mouseleave', () => {
            if (!isDragging) {
                idCard.style.transition = 'transform 0.5s ease';
                idCard.style.transform = `rotateX(0deg) rotateY(0deg) ${isFlipped ? 'rotateY(180deg)' : ''}`;
            }
        });
        
        idCardContainer.addEventListener('mouseenter', () => {
             idCard.style.transition = '';
        });

        idCardContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            idCardContainer.style.cursor = 'grabbing';
            startX = e.clientX;
            startY = e.clientY;
            const transform = window.getComputedStyle(idCardContainer).transform;
            if (transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                initialX = matrix.m41;
                initialY = matrix.m42;
            } else {
                initialX = 0;
                initialY = 0;
            }
            e.preventDefault();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                idCardContainer.style.cursor = 'grab';
                idCardContainer.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
                idCardContainer.style.transform = 'translate(0, 0)';
                setTimeout(() => {
                    idCardContainer.style.transition = '';
                }, 400);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                idCardContainer.style.transform = `translate(${initialX + dx}px, ${initialY + dy}px)`;
            }
        });
    }

    // --- Chatbot functionality ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMinimize = document.getElementById('chatbot-minimize');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInputField = document.getElementById('chatbot-input-field');
    const chatbotSendButton = document.getElementById('chatbot-send');

    if (chatbotToggle) {
        let isOpen = false;
        let isMinimized = false;

        // Drag functionality
        let isDragging = false;
        let initialX, initialY;
        let offsetX, offsetY;

        chatbotWindow.addEventListener('mousedown', (e) => {
            if (e.target.id === 'drag-handle-top-left') { // Only drag from top-left handle
                isDragging = true;
                initialX = e.clientX;
                initialY = e.clientY;
                const rect = chatbotWindow.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                chatbotWindow.style.transition = 'none'; // Disable transition during drag
                chatbotWindow.style.cursor = 'grabbing';
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;

                // Boundary checks
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                const chatbotRect = chatbotWindow.getBoundingClientRect();

                if (newX < 0) newX = 0;
                if (newY < 0) newY = 0;
                if (newX + chatbotRect.width > windowWidth) newX = windowWidth - chatbotRect.width;
                if (newY + chatbotRect.height > windowHeight) newY = windowHeight - chatbotRect.height;

                chatbotWindow.style.left = `${newX}px`;
                chatbotWindow.style.top = `${newY}px`;
                chatbotWindow.style.right = 'auto'; // Disable right/bottom positioning
                chatbotWindow.style.bottom = 'auto';
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                chatbotWindow.style.transition = ''; // Re-enable transition
                chatbotWindow.style.cursor = 'grab';
            }
        });

        chatbotToggle.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                chatbotWindow.classList.add('open');
                isMinimized = false;
                chatbotBody.classList.remove('minimized');
            } else {
                chatbotWindow.classList.remove('open');
            }
        });

        chatbotClose.addEventListener('click', () => {
            isOpen = false;
            chatbotWindow.classList.remove('open');
        });

        chatbotMinimize.addEventListener('click', () => {
            isMinimized = !isMinimized;
            chatbotBody.classList.toggle('minimized');
        });

        chatbotSendButton.addEventListener('click', sendMessage);
        chatbotInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        function sendMessage() {
            const userMessage = chatbotInputField.value.trim();
            if (userMessage === '') return;

            appendMessage(userMessage, 'user');
            chatbotInputField.value = '';
            showTypingIndicator();

            fetch('https://my-portfolio-chatbot-backend.onrender.com/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'Server error'); });
                }
                return response.json();
            })
            .then(data => {
                hideTypingIndicator();
                if (data.reply) {
                    appendMessage(data.reply, 'bot');
                } else if (data.error) {
                    appendMessage(`Error: ${data.error}`, 'bot');
                }
            })
            .catch(error => {
                hideTypingIndicator();
                let errorMessage = 'Sorry, something went wrong. Please try again later.';
                if (error.message) {
                    errorMessage = `Error: ${error.message}`;
                }
                appendMessage(errorMessage, 'bot');
                console.error('Error sending message:', error);
            });
        }

        function appendMessage(text, type) {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${type}-message`;
            const p = document.createElement('p');
            p.textContent = text;
            messageElement.appendChild(p);
            chatbotMessages.appendChild(messageElement);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function showTypingIndicator() {
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message bot-message typing-indicator';
            typingIndicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function hideTypingIndicator() {
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
    }
});

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