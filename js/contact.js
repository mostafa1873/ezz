document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // تغيير حالة زر الإرسال
    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // تجهيز البيانات
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        phone_number: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        reply_to: document.getElementById('email').value
    };

    // إرسال الإيميل
    emailjs.send(
        'YOUR_SERVICE_ID', // معرف الخدمة من EmailJS
        'YOUR_TEMPLATE_ID', // معرف القالب من EmailJS
        templateParams
    )
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
            showMessage('Message sent successfully! We will contact you soon.', 'success');
            document.getElementById('contactForm').reset();
        })
        .catch(function (error) {
            console.log('FAILED...', error);
            showMessage('Failed to send message. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;

    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'form-message';
    }, 5000);
}