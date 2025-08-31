<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Local Contact Form Test</title>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .form-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        input, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #007bff;
        }
        .field-error {
            border-color: #dc3545 !important;
        }
        .error-message {
            color: #dc3545;
            font-size: 14px;
            margin-top: 5px;
        }
        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .submit-btn {
            background: #007bff;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
        }
        .submit-btn:hover {
            background: #0056b3;
        }
        .submit-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }
        .char-counter {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .char-counter.met {
            color: #28a745;
        }
        .char-counter.not-met {
            color: #dc3545;
        }
        .recaptcha-container {
            margin: 20px 0;
            display: flex;
            justify-content: center;
        }
        .test-info {
            background: #e7f3ff;
            border: 1px solid #007bff;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="test-info">
            <strong>Local Test Form</strong><br>
            This form will submit to your PHP backend. Make sure you're running this on a server with PHP support and your backend files are properly configured.
        </div>

        <h1>Contact Form Test</h1>
        
        <div id="success-message" class="success-message" style="display: none;">
            Email sent successfully! Check your inbox.
        </div>

        <form id="contact-form">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
                <div id="name-error" class="error-message" style="display: none;"></div>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
                <div id="email-error" class="error-message" style="display: none;"></div>
            </div>

            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="6" required></textarea>
                <div id="char-counter" class="char-counter not-met">0 of 50 characters minimum</div>
                <div id="message-error" class="error-message" style="display: none;"></div>
            </div>

            <div class="recaptcha-container">
                <div class="g-recaptcha" data-sitekey="6LeJArErAAAAACj8P0jXHJu0D9FWOY6kkC3xiinh"></div>
            </div>

            <div id="submit-error" class="error-message" style="display: none; margin-bottom: 15px;"></div>

            <button type="submit" class="submit-btn" id="submit-btn">Send Test Email</button>
        </form>
    </div>

    <script>
        const form = document.getElementById('contact-form');
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        const submitBtn = document.getElementById('submit-btn');
        const charCounter = document.getElementById('char-counter');

        // Character counter for message field
        messageField.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = `${length} of 50 characters minimum`;
            charCounter.className = length >= 50 ? 'char-counter met' : 'char-counter not-met';
        });

        // Form validation
        function validateForm() {
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
            document.querySelectorAll('input, textarea').forEach(el => el.classList.remove('field-error'));

            // Validate name
            if (!nameField.value.trim()) {
                showError('name-error', 'Name is required');
                nameField.classList.add('field-error');
                isValid = false;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailField.value.trim() || !emailRegex.test(emailField.value)) {
                showError('email-error', 'Valid email is required');
                emailField.classList.add('field-error');
                isValid = false;
            }

            // Validate message
            if (!messageField.value.trim() || messageField.value.trim().length < 50) {
                showError('message-error', 'Message must be at least 50 characters');
                messageField.classList.add('field-error');
                isValid = false;
            }

            return isValid;
        }

        function showError(elementId, message) {
            const errorEl = document.getElementById(elementId);
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }

        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            // Check reCAPTCHA
            const recaptchaResponse = window.grecaptcha ? window.grecaptcha.getResponse() : '';
            if (!recaptchaResponse) {
                showError('submit-error', 'Please complete the reCAPTCHA verification.');
                document.getElementById('submit-error').style.display = 'block';
                return;
            }

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Prepare form data
                const formData = new FormData();
                formData.append('name', nameField.value.trim());
                formData.append('email', emailField.value.trim());
                formData.append('message', messageField.value.trim());
                formData.append('g-recaptcha-response', recaptchaResponse);

                // Submit to PHP backend
                const response = await fetch('/submit.php', {
                    method: 'POST',
                    body: formData
                });

                const responseText = await response.text();
                console.log('Server response:', responseText);

                if (response.ok && (responseText.includes('Success') || responseText.includes('sent successfully'))) {
                    // Show success message
                    document.getElementById('success-message').style.display = 'block';
                    form.style.display = 'none';
                    
                    // Reset reCAPTCHA
                    if (window.grecaptcha) {
                        window.grecaptcha.reset();
                    }
                } else {
                    showError('submit-error', responseText || 'Failed to send. Please try again.');
                    document.getElementById('submit-error').style.display = 'block';
                }

            } catch (error) {
                console.error('Network error:', error);
                showError('submit-error', 'Network error. Please check your connection and try again.');
                document.getElementById('submit-error').style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Test Email';
            }
        });
    </script>
</body>
</html>