document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Adjust for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero background
    const heroSection = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`; // Subtle parallax
    });

    // Fade-in animation for hero content
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transition = 'opacity 1s ease-in-out';
    setTimeout(() => {
        heroContent.style.opacity = '1';
    }, 500); // Delay for a smoother load

    // Set minimum date for the date picker to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Form submission handling
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    const messageContainer = document.createElement('div');
    messageContainer.className = 'form-message';
    form.appendChild(messageContainer);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        // Basic client-side validation
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const date = form.querySelector('#date').value;
        const haircut = form.querySelector('#haircut').value;
        const barber = form.querySelector('#barber').value;

        if (!name || !email || !date || !haircut || !barber) {
            showMessage('Por favor, completa todos los campos.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Solicitud de Cita';
            return;
        }

        // Check if selected date is within business hours
        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
        if (dayOfWeek === 0) {
            showMessage('Lo sentimos, estamos cerrados los domingos.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Solicitud de Cita';
            return;
        }

        // Prepare form data
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showMessage('¡Solicitud de cita enviada! Revisa tu correo para la confirmación.', 'success');
                form.reset();
            } else {
                throw new Error('Error al enviar la solicitud.');
            }
        } catch (error) {
            showMessage('Error al enviar la solicitud. Intenta de nuevo más tarde.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Solicitud de Cita';
        }
    });

    // Function to display messages
    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.color = type === 'success' ? '#28a745' : '#dc3545';
        messageContainer.style.backgroundColor = type === 'success' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)';
        messageContainer.style.padding = '0.5rem';
        messageContainer.style.borderRadius = '5px';
        messageContainer.style.marginTop = '1rem';
        messageContainer.style.textAlign = 'center';
        messageContainer.style.fontWeight = 'bold';

        // Clear message after 5 seconds
        setTimeout(() => {
            messageContainer.textContent = '';
            messageContainer.style.backgroundColor = 'transparent';
        }, 5000);
    }
});