document.addEventListener("DOMContentLoaded", function () {
    // SET CURRENT YEAR
    const yearEl = document.getElementById("currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // NEWSLETTER FORM 
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const emailInput = document.getElementById("newsletter-email");
            const email = emailInput.value.trim();
            const successMessage = document.getElementById("newsletter-success");

            if (!email) {
                displayMessage(successMessage, "Please enter a valid email.", "red");
                return;
            }

            try {
                const response = await fetch("/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (response.ok) {
                    displayMessage(successMessage, data.message, "#ecc7d1");
                    emailInput.value = "";
                } else {
                    displayMessage(successMessage, data.errors ? data.errors[0].msg : "An error occurred.", "red");
                }
            } catch (error) {
                console.error("Newsletter Error:", error);
                displayMessage(successMessage, "An error occurred. Please try again later.", "red");
            }
        });
    }

    // CONTACT FORM
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const phoneInput = document.getElementById("phone");
            const serviceInput = document.getElementById("service");
            const messageInput = document.getElementById("message");
            const submitBtn = document.getElementById("submit-btn");
            const recaptchaDiv = document.querySelector(".g-recaptcha");

            const recaptchaToken = grecaptcha.getResponse();
            if (!recaptchaToken) {
                showRecaptchaError(recaptchaDiv);
                return;
            }

            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                service: serviceInput.value.trim(),
                message: messageInput.value.trim(),
                "g-recaptcha-response": recaptchaToken,
            };

            if (!validateForm(formData)) return;

            try {
                updateButton(submitBtn, "Sending...", true);

                const response = await fetch("/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                if (response.ok && data.success) {
                    updateButton(submitBtn, "Message Sent", false, "green");
                    contactForm.reset();
                    grecaptcha.reset();
                } else {
                    updateButton(submitBtn, "Failed to Send", false, "red");
                }
            } catch (error) {
                console.error("Contact Form Error:", error);
                updateButton(submitBtn, "Error Sending", false, "red");
            }
        });
    }

    // CHAT MODAL
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
    const chatModal = document.getElementById('chatModal');

    if (chatModal) {
        chatModal.addEventListener('shown.bs.modal', function () {
            chatMessages.innerHTML = '';
            const welcomeMsg = document.createElement("div");
            welcomeMsg.innerHTML = `<strong>Assistant:</strong> Hello! How can I help you with your renovation today?`;
            chatMessages.appendChild(welcomeMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    if (chatForm) {
        chatForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            const userMsgElement = document.createElement("div");
            userMsgElement.innerHTML = `<strong>You:</strong> ${userMessage}`;
            chatMessages.appendChild(userMsgElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            chatInput.value = "";

            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chatPrompt: userMessage })
            })
            .then(response => response.json())
            .then(data => {
                const aiMsgElement = document.createElement("div");
                aiMsgElement.innerHTML = `<strong>Assistant:</strong> ${data.result}`;
                chatMessages.appendChild(aiMsgElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(err => {
                console.error('Error:', err);
                const errorMsg = document.createElement("div");
                errorMsg.innerHTML = `<strong>Error:</strong> Could not get a reply.`;
                chatMessages.appendChild(errorMsg);
            });
        });
    }

    // HELPER FUNCTIONS 
    function displayMessage(element, text, color) {
        if (!element) return;
        element.style.display = "block";
        element.textContent = text;
        element.style.color = color;
        setTimeout(() => {
            element.style.display = "none";
        }, 5000);
    }

    function showRecaptchaError(recaptchaDiv) {
        if (!recaptchaDiv) return;
        const existingError = document.getElementById("recaptcha-error");
        if (!existingError) {
            const errorMessage = document.createElement("p");
            errorMessage.id = "recaptcha-error";
            errorMessage.textContent = "Please complete the reCAPTCHA.";
            errorMessage.style.color = "red";
            errorMessage.style.marginTop = "3px";
            recaptchaDiv.parentNode.appendChild(errorMessage);
        }
    }

    function validateForm(formData) {
        for (const key in formData) {
            if (!formData[key]) {
                alert(`Please fill out the ${key.replace("-", " ")} field.`);
                return false;
            }
        }
        return true;
    }

    function updateButton(button, text, disable, color = "") {
        if (!button) return;
        button.textContent = text;
        button.disabled = disable;
        button.style.backgroundColor = color;

        setTimeout(() => {
            button.textContent = "Get Appointment";
            button.style.backgroundColor = "";
            button.disabled = false;
        }, 5000);
    }
});
