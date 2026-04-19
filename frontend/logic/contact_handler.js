/**
 * contact_handler.js
 * Extracted logic for handling Contact Form interactions across the portfolio.
 * Dynamically resolves target variables based on standard data architectures.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Detect page context
    const path = window.location.pathname;
    const isFAQ = path.includes('asked-questions');
    const dataFile = isFAQ ? 'faq_contact.json' : 'contact_page.json';

    let contactConfig = {
        whatsapp_number: '8294721929',
        email: 'abhinavranjanmit@gmail.com',
        telegram_username: 'abhinav_ranjan',
        google_script_url: 'YOUR_GOOGLE_SCRIPT_URL_HERE',
        routing_department: 'General Inquiry'
    };

    // Attempt to preload specific route config
    fetch(`../data/${dataFile}`)
        .then(r => r.json())
        .then(data => { contactConfig = { ...contactConfig, ...data }; })
        .catch(err => console.warn('Could not load specific contact config, using defaults.', err));

    const getFormData = () => ({
        name: (document.getElementById('name') || {}).value || '',
        email: (document.getElementById('email') || {}).value || '',
        contactNo: (document.getElementById('contactNo') || {}).value || '',
        message: (document.getElementById('message') || {}).value || '',
        department: contactConfig.routing_department
    });

    const showToast = (msg) => {
        let t = document.getElementById('toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'toast';
            t.className = 'toast';
            document.body.appendChild(t);
        }
        t.innerText = msg;
        t.className = 'toast show';
        setTimeout(() => { t.className = t.className.replace('show', ''); }, 3000);
    };

    const buildMessage = (data) => {
        let msg = contactConfig.message_format || "Name: {name}\nEmail: {email}\nPhone: {contactNo}\nMessage: {message}";
        return msg.replace('{name}', data.name).replace('{email}', data.email).replace('{contactNo}', data.contactNo).replace('{message}', data.message);
    };

    /* WhatsApp Target */
    document.getElementById('sendWhatsapp')?.addEventListener('click', e => {
        e.preventDefault();
        const data = getFormData();
        if (!data.name || !data.message) { showToast('Fill Name and Message'); return; }
        
        const payload = encodeURIComponent(buildMessage(data));
        window.open(`https://wa.me/${contactConfig.whatsapp_number}?text=${payload}`, '_blank');
    });

    /* Email Target */
    document.getElementById('sendEmail')?.addEventListener('click', e => {
        e.preventDefault();
        const data = getFormData();
        if (!data.name || !data.message) { showToast('Fill Name and Message'); return; }
        
        const payload = encodeURIComponent(buildMessage(data));
        const subject = encodeURIComponent(`${contactConfig.routing_department} from ${data.name}`);
        window.location.href = `mailto:${contactConfig.email}?subject=${subject}&body=${payload}`;
    });

    /* Telegram Target */
    document.getElementById('sendTelegram')?.addEventListener('click', e => {
        e.preventDefault();
        const data = getFormData();
        if (!data.name || !data.message) { showToast('Fill Name and Message'); return; }
        
        const payload = encodeURIComponent(buildMessage(data));
        window.open(`https://t.me/${contactConfig.telegram_username}?text=${payload}`, '_blank');
    });

    /* Direct Web Server Target (Google Apps Script) */
    const webBtn = document.getElementById('sendWeb');
    webBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        const formData = getFormData();
        if (!formData.name || !formData.message) { showToast('Fill Name and Message'); return; }
        
        const url = contactConfig.google_script_url;
        if (!url || url === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            showToast('Form not connected yet. Try WhatsApp or Email.');
            return;
        }

        // Change button state to indicate processing
        const originalText = webBtn.innerHTML;
        webBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        webBtn.disabled = true;

        try {
            // Google Apps Script requires text/plain or x-www-form-urlencoded to bypass strict CORS
            const formBody = new URLSearchParams();
            for (const key in formData) { formBody.append(key, formData[key]); }
            formBody.append("formatted_message", buildMessage(formData));

            const response = await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody.toString()
            });
            showToast('Message sent successfully!');
            document.getElementById('contactForm')?.reset();
        } catch (error) {
            console.error('Transmission failed:', error);
            showToast('Network error while sending. Try WhatsApp.');
        } finally {
            webBtn.innerHTML = originalText;
            webBtn.disabled = false;
        }
    });
});
