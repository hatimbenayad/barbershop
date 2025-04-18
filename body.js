document.addEventListener('DOMContentLoaded', () => {
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
        submitButton.textContent = 'Sending...';

        // Basic client-side validation
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const date = form.querySelector('#date').value;
        const haircut = form.querySelector('#haircut').value;
        const barber = form.querySelector('#barber').value;

        if (!name || !email || !date || !haircut || !barber) {
            showMessage('Please fill out all fields.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Appointment Request';
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
                showMessage('Appointment request sent! Check your email for confirmation.', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send appointment request.');
            }
        } catch (error) {
            showMessage('Error sending request. Please try again later.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Appointment Request';
        }
    });

    // Function to display messages
    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.color = type === 'success' ? '#28a745' : '#dc3545';
        messageContainer.style.marginTop = '1rem';
        messageContainer.style.textAlign = 'center';
        messageContainer.style.fontWeight = 'bold';

        // Clear message after 5 seconds
        setTimeout(() => {
            messageContainer.textContent = '';
        }, 5000);
    }
});