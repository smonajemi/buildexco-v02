
/* NEWSLETTER */
document.getElementById('newsletter-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value;
    const successMessage = document.getElementById('newsletter-success');

    try {
        // Send a POST request to the Node.js backend
        const response = await fetch('/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'x-api-key': '8e7a2291-4f8c-4f6f-b6d0-fe18bbdb04fc'
            },
            body: JSON.stringify({ email }), // Send email in the body
        });

        const data = await response.json();

        if (response.ok) {
            // If subscription is successful, display success message and clear form
            successMessage.style.display = 'block';
            successMessage.textContent = data.message; // "Newsletter subscription successful"
            successMessage.style.color = '#ecc7d1';
            emailInput.value = ''; // Clear the email field
            // Remove the message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        } else {
            // Display error message if there's an error
            successMessage.style.display = 'block';
            successMessage.textContent = data.errors ? data.errors[0].msg : '';
            successMessage.style.color = '#ecc7d1';
            successMessage.style.display = 'none';
            // Remove the message after 5 seconds
            setTimeout(() => {
             
                emailInput.value = ''; // Clear the email field
            }, 5000);
        }
    } catch (error) {
        console.error('Error:', error);
        successMessage.style.display = 'block';
        successMessage.textContent = 'An error occurred. Please try again later.';
        successMessage.style.color = '#ecc7d1';
        // Remove the message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
});


// CONTACT FORM

document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const serviceInput = document.getElementById('service');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');
    const recaptchaDiv = document.querySelector('.g-recaptcha'); // Get reCAPTCHA div

    // Remove existing error message if present
    const existingError = document.getElementById('recaptcha-error');
    if (existingError) {
        existingError.remove();
    }

    // Get reCAPTCHA token
    const recaptchaToken = grecaptcha.getResponse();

    if (!recaptchaToken) {
        // Add a red error message below the reCAPTCHA
        const errorMessage = document.createElement('p');
        errorMessage.id = 'recaptcha-error';
        errorMessage.textContent = 'Please complete the reCAPTCHA.';
        errorMessage.style.color = 'red';
        errorMessage.style.marginTop = '3px';
        recaptchaDiv.parentNode.appendChild(errorMessage); // Append below reCAPTCHA
        return;
    }

    // Gather form data
    const formData = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        service: serviceInput.value,
        message: messageInput.value,
        'g-recaptcha-response': recaptchaToken // Include reCAPTCHA token
    };

    try {
        // Change the button text to indicate form submission in progress
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true; // Disable the button to prevent multiple submissions

        // Send a POST request to the Node.js backend
        const response = await fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'x-api-key': '8e7a2291-4f8c-4f6f-b6d0-fe18bbdb04fc'
            },
            body: JSON.stringify(formData), // Send the form data
        });

        const data = await response.json();

        // // Debugging: Log response and data
        // console.log('Response:', response);
        // console.log('Response Data:', data);

        if (response.ok && data.success) {
            // On success, change button text to "Message Sent"
            submitBtn.textContent = 'Message Sent';
            submitBtn.style.backgroundColor = 'green'; // Optional: Change button color to indicate success

            // Clear the form fields
            nameInput.value = '';
            emailInput.value = '';
            phoneInput.value = '';
            serviceInput.value = '';
            messageInput.value = '';

            // Reset reCAPTCHA
            grecaptcha.reset();

            // Reset button text after 5 seconds
            setTimeout(() => {
                submitBtn.textContent = 'Get Appointment';
                submitBtn.style.backgroundColor = ''; // Reset to original button color
                submitBtn.disabled = false; // Re-enable the button
            }, 5000);
        } else {
            // On error, change button text to "Failed to Send"
            submitBtn.textContent = 'Failed to Send';
            submitBtn.style.backgroundColor = 'red'; // Optional: Change button color to indicate failure

            // Reset button text after 5 seconds
            setTimeout(() => {
                submitBtn.textContent = 'Get Appointment';
                submitBtn.style.backgroundColor = ''; // Reset to original button color
                submitBtn.disabled = false; // Re-enable the button
            }, 5000);
        }
    } catch (error) {
        console.error('Error:', error);
        submitBtn.textContent = 'Error Sending';
        submitBtn.style.backgroundColor = 'red';

        // Reset button text after 5 seconds
        setTimeout(() => {
            submitBtn.textContent = 'Get Appointment';
            submitBtn.style.backgroundColor = ''; // Reset to original button color
            submitBtn.disabled = false; // Re-enable the button
        }, 5000);
    }
});



