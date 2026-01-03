// Service definitions with pricing
const services = {
    normal: [
        { id: 'individual', name: 'Individual Therapy', price: 500, online: false },
        { id: 'couples', name: 'Counselling Session (1 hour)', price: 500, online: true },
        { id: 'cbt', name: 'Cognitive Behavioral Therapy (CBT)', price: 500, online: false },
        { id: 'stress', name: 'Stress Management', price: 500, online: false },
        { id: 'grief', name: 'Grief & Loss Counseling', price: 500, online: false },
        { id: 'career', name: 'Career Counseling', price: 500, online: false }
    ],
    therapy: [
        { id: 'anxiety', name: 'Anxiety & Depression Treatment', price: 1500, note: 'Contact clinic for final price' },
        { id: 'family', name: 'Family Therapy', price: 1500, note: 'Contact clinic for final price' },
        { id: 'child', name: 'Child & Adolescent Therapy', price: 1500, note: 'Contact clinic for final price' },
        { id: 'trauma', name: 'Trauma Therapy', price: 1500, note: 'Contact clinic for final price' },
        { id: 'group', name: 'Group Therapy', price: 1500, note: 'Contact clinic for final price' },
        { id: 'assessment', name: 'Psychological Assessments', price: 1500, note: 'Contact clinic for final price' }
    ]
};

let selectedMode = 'offline';
let selectedServices = [];
let totalAmount = 0;

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Set initial mode (offline by default)
    setMode('offline');

    // Initialize services
    renderServices();

    // Mode selection with better event handling
    const modeOffline = document.getElementById('modeOffline');
    const modeOnline = document.getElementById('modeOnline');
    
    if (modeOffline) {
        modeOffline.addEventListener('click', () => setMode('offline'));
    }
    if (modeOnline) {
        modeOnline.addEventListener('click', () => setMode('online'));
    }

    // Form submission with custom validation
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Custom validation for timing (only required for online mode)
            if (selectedMode === 'online') {
                const timingSelected = document.querySelector('input[name="timing"]:checked');
                if (!timingSelected) {
                    e.preventDefault();
                    alert('Please select a preferred timing for your online consultation.');
                    document.getElementById('timingSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return false;
                }
            }
            
            // Proceed with normal form submission
            handleFormSubmit(e);
        });
    }

    // Timing option styling
    document.querySelectorAll('.timing-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.timing-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
});

function renderServices() {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) {
        console.error('Services list container not found!');
        return;
    }
    
    servicesList.innerHTML = '';

    if (selectedMode === 'online') {
        // Online: Only show services marked as available online
        services.normal.forEach(service => {
            const isDisabled = !service.online;
            const serviceCard = createServiceCard(service, isDisabled);
            servicesList.appendChild(serviceCard);
        });
        // All therapy services disabled for online
        services.therapy.forEach(service => {
            const serviceCard = createServiceCard(service, true);
            servicesList.appendChild(serviceCard);
        });
    } else {
        // Offline: Show all services
        services.normal.forEach(service => {
            const serviceCard = createServiceCard(service, false);
            servicesList.appendChild(serviceCard);
        });
        services.therapy.forEach(service => {
            const serviceCard = createServiceCard(service, false);
            servicesList.appendChild(serviceCard);
        });
    }
    
    console.log(`Services rendered for ${selectedMode} mode:`, servicesList.children.length, 'services');
}

function createServiceCard(service, isDisabled) {
    const div = document.createElement('div');
    div.className = `service-option ${isDisabled ? 'disabled' : ''}`;
    div.dataset.serviceId = service.id;

    const priceText = service.price === 1500 
        ? `<span class="service-price">₹${service.price}+</span><span class="service-price-note">*${service.note || ''}</span>`
        : `<span class="service-price">₹${service.price}</span>`;

    div.innerHTML = `
        <div style="display: flex; align-items: center; flex: 1;">
            <input type="checkbox" ${isDisabled ? 'disabled' : ''} 
                   data-service-id="${service.id}" 
                   data-price="${service.price}">
            <span class="service-name">${service.name}</span>
        </div>
        ${priceText}
    `;

    if (!isDisabled) {
        const checkbox = div.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', handleServiceToggle);
    }

    return div;
}

function handleServiceToggle(event) {
    const checkbox = event.target;
    const serviceId = checkbox.dataset.serviceId;
    const price = parseInt(checkbox.dataset.price);
    const serviceCard = checkbox.closest('.service-option');

    if (checkbox.checked) {
        selectedServices.push({ id: serviceId, price: price });
        serviceCard.classList.add('selected');
    } else {
        selectedServices = selectedServices.filter(s => s.id !== serviceId);
        serviceCard.classList.remove('selected');
    }

    calculateTotal();
}

function setMode(mode) {
    selectedMode = mode;
    const modeInput = document.getElementById('consultationMode');
    if (modeInput) {
        modeInput.value = mode;
    }

    // Update UI - ensure elements exist
    const modeOfflineEl = document.getElementById('modeOffline');
    const modeOnlineEl = document.getElementById('modeOnline');
    
    if (modeOfflineEl && modeOnlineEl) {
        modeOfflineEl.classList.toggle('active', mode === 'offline');
        modeOnlineEl.classList.toggle('active', mode === 'online');
    }

    // Show/hide timing section for online
    const timingSection = document.getElementById('timingSection');
    const onlineNote = document.getElementById('onlineModeNote');
    if (mode === 'online') {
        if (timingSection) timingSection.style.display = 'block';
        if (onlineNote) onlineNote.style.display = 'block';
    } else {
        if (timingSection) {
            timingSection.style.display = 'none';
            // Clear timing selection when switching to offline
            document.querySelectorAll('#timingSection input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
        }
        if (onlineNote) onlineNote.style.display = 'none';
    }

    // Reset services and re-render
    selectedServices = [];
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    renderServices();
    calculateTotal();

    // For online mode, automatically select counselling after render
    if (mode === 'online') {
        setTimeout(() => {
            const counsellingCheckbox = document.querySelector('input[data-service-id="couples"]');
            if (counsellingCheckbox && !counsellingCheckbox.disabled) {
                counsellingCheckbox.checked = true;
                counsellingCheckbox.dispatchEvent(new Event('change'));
            }
        }, 200);
    }
}

function calculateTotal() {
    if (selectedMode === 'online') {
        // Online: fixed ₹500 per session (counselling only)
        totalAmount = selectedServices.length * 500;
    } else {
        // Offline: sum of all selected services
        totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);
    }

    const totalEl = document.getElementById('totalAmount');
    if (totalEl) {
        totalEl.textContent = `₹${totalAmount}`;
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('patientName').value,
        age: document.getElementById('patientAge').value,
        phone: document.getElementById('patientPhone').value,
        email: document.getElementById('patientEmail').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        date: document.getElementById('appointmentDate').value,
        mode: selectedMode,
        services: selectedServices,
        timing: selectedMode === 'online' ? document.querySelector('input[name="timing"]:checked')?.value : null,
        totalAmount: totalAmount
    };

    // Generate order number
    const orderNumber = 'DC-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // Show receipt
    showReceipt(formData, orderNumber);

    // Generate and send receipt
    generateAndSendReceipt(formData, orderNumber);
}

function showReceipt(formData, orderNumber) {
    const formContainer = document.getElementById('appointmentFormContainer');
    const receiptContainer = document.getElementById('receiptContainer');
    
    if (formContainer) formContainer.style.display = 'none';
    if (receiptContainer) receiptContainer.style.display = 'block';

    const orderNumberEl = document.getElementById('orderNumber');
    if (orderNumberEl) {
        orderNumberEl.textContent = `Order #${orderNumber}`;
    }

    const receiptDetails = document.getElementById('receiptDetails');
    if (!receiptDetails) return;

    const selectedServiceNames = formData.services.map(s => {
        const allServices = [...services.normal, ...services.therapy];
        const service = allServices.find(svc => svc.id === s.id);
        return service ? service.name : s.id;
    });

    receiptDetails.innerHTML = `
        <div class="receipt-row">
            <span class="receipt-label">Name:</span>
            <span class="receipt-value">${formData.name}</span>
        </div>
        <div class="receipt-row">
            <span class="receipt-label">Age:</span>
            <span class="receipt-value">${formData.age} years</span>
        </div>
        <div class="receipt-row">
            <span class="receipt-label">Gender:</span>
            <span class="receipt-value">${formData.gender}</span>
        </div>
        <div class="receipt-row">
            <span class="receipt-label">Phone:</span>
            <span class="receipt-value">${formData.phone}</span>
        </div>
        <div class="receipt-row">
            <span class="receipt-label">Email:</span>
            <span class="receipt-value">${formData.email}</span>
        </div>
        <div class="receipt-row">
            <span class="receipt-label">Appointment Date:</span>
            <span class="receipt-value">${formatDate(formData.date)}</span>
        </div>
        <div class="receipt-row">
            <span class="receipt-label">Mode:</span>
            <span class="receipt-value">${formData.mode === 'online' ? 'Online Consultation' : 'Offline Consultation'}</span>
        </div>
        ${formData.timing ? `
        <div class="receipt-row">
            <span class="receipt-label">Preferred Timing:</span>
            <span class="receipt-value">${formData.timing}</span>
        </div>
        ` : ''}
        <div class="receipt-services">
            <h4 style="margin-bottom: 15px; color: var(--primary-color);">Services:</h4>
            ${selectedServiceNames.map((name, index) => {
                const service = formData.services[index];
                return `
                    <div class="receipt-service-item">
                        <div style="display: flex; justify-content: space-between;">
                            <span>${name}</span>
                            <span style="color: var(--primary-color); font-weight: 600;">₹${service.price}${service.price === 1500 ? '+' : ''}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <div class="receipt-row" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--primary-color);">
            <span class="receipt-label" style="font-size: 1.2rem;">Total Amount:</span>
            <span class="receipt-value" style="font-size: 1.2rem; color: var(--primary-color); font-weight: 700;">₹${formData.totalAmount}</span>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: var(--bg-light); border-radius: 10px; text-align: center;">
            <p style="color: var(--text-light); margin: 0;">
                📄 Receipt PDF has been downloaded<br>
                📧 Email will be sent to <strong>${formData.email}</strong><br>
                📱 Confirmation will be sent to <strong>${formData.phone}</strong>
            </p>
        </div>
    `;

    // Show countdown and redirect (only for online)
    if (formData.mode === 'online') {
        setTimeout(() => {
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) {
                countdownEl.style.display = 'block';
                startCountdown();
            }
        }, 1000);
    } else {
        // For offline, show a message after 3 seconds
        setTimeout(() => {
            const countdownDiv = document.getElementById('countdown');
            if (countdownDiv) {
                countdownDiv.style.display = 'block';
                countdownDiv.innerHTML = '<p style="color: var(--primary-color);">Your appointment has been confirmed! You can close this page or return to home.</p>';
            }
        }, 2000);
    }
}

function startCountdown() {
    let count = 5;
    const countdownElement = document.getElementById('countdownNumber');
    if (!countdownElement) return;
    
    const interval = setInterval(() => {
        count--;
        countdownElement.textContent = count;
        
        if (count <= 0) {
            clearInterval(interval);
            window.location.href = 'index.html';
        }
    }, 1000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function generateAndSendReceipt(formData, orderNumber) {
    // Generate PDF using jsPDF
    let pdfBlob = null;
    let pdfBase64 = null;
    if (typeof window.jspdf !== 'undefined') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        let yPos = 20;
        
        // Header
        doc.setFillColor(44, 122, 123);
        doc.rect(0, 0, 210, 50, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('Divine Care', 105, 20, { align: 'center' });
        doc.setFontSize(14);
        doc.text('Dr. Neelam Mishra', 105, 30, { align: 'center' });
        doc.setFontSize(11);
        doc.text('Rehabilitation & Clinical Psychologist', 105, 38, { align: 'center' });
        doc.setFontSize(9);
        doc.text('RCI Registered | Varanasi, Uttar Pradesh', 105, 44, { align: 'center' });
        
        // Order Number
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Order #${orderNumber}`, 105, 60, { align: 'center' });
        
        yPos = 70;
        
        // Personal Details
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Personal Information', 20, yPos);
        yPos += 10;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        doc.text(`Name: ${formData.name}`, 20, yPos);
        yPos += 7;
        doc.text(`Age: ${formData.age} years`, 20, yPos);
        yPos += 7;
        doc.text(`Gender: ${formData.gender}`, 20, yPos);
        yPos += 7;
        doc.text(`Phone: ${formData.phone}`, 20, yPos);
        yPos += 7;
        doc.text(`Email: ${formData.email}`, 20, yPos);
        yPos += 10;
        
        // Appointment Details
        doc.setFont(undefined, 'bold');
        doc.text('Appointment Details', 20, yPos);
        yPos += 10;
        
        doc.setFont(undefined, 'normal');
        doc.text(`Date: ${formatDate(formData.date)}`, 20, yPos);
        yPos += 7;
        doc.text(`Mode: ${formData.mode === 'online' ? 'Online Consultation' : 'Offline Consultation'}`, 20, yPos);
        yPos += 7;
        if (formData.timing) {
            doc.text(`Timing: ${formData.timing}`, 20, yPos);
            yPos += 7;
        }
        yPos += 5;
        
        // Services
        doc.setFont(undefined, 'bold');
        doc.text('Services Booked:', 20, yPos);
        yPos += 10;
        
        doc.setFont(undefined, 'normal');
        formData.services.forEach(service => {
            const allServices = [...services.normal, ...services.therapy];
            const serviceObj = allServices.find(svc => svc.id === service.id);
            const serviceName = serviceObj ? serviceObj.name : service.id;
            const servicePrice = `₹${service.price}${service.price === 1500 ? '+' : ''}`;
            
            doc.text(serviceName, 25, yPos);
            doc.text(servicePrice, 180, yPos, { align: 'right' });
            yPos += 7;
            
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
        });
        
        yPos += 5;
        doc.setDrawColor(44, 122, 123);
        doc.setLineWidth(0.5);
        doc.line(20, yPos, 190, yPos);
        yPos += 10;
        
        // Total
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.text('Total Amount:', 20, yPos);
        doc.text(`₹${formData.totalAmount}`, 180, yPos, { align: 'right' });
        yPos += 15;
        
        // Footer
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for choosing Divine Care!', 105, yPos, { align: 'center' });
        yPos += 5;
        doc.text('Please arrive 10 minutes before your appointment time.', 105, yPos, { align: 'center' });
        yPos += 5;
        doc.setFontSize(9);
        doc.text('Address: 1 P, D-59/79, Sigra - Mahmoorganj Rd, Mahmoorganj, Varanasi, UP 221010', 105, yPos, { align: 'center' });
        yPos += 5;
        doc.text('Phone: 089576 04340 | Email: divinecare.psychologist@gmail.com', 105, yPos, { align: 'center' });
        
        // Generate PDF blob and base64 for email attachment
        pdfBlob = doc.output('blob');
        pdfBase64 = doc.output('datauristring').split(',')[1]; // Get base64 part
        
        // Download PDF
        doc.save(`DivineCare_Receipt_${orderNumber}.pdf`);
    }
    
    // Send email with receipt (try backend first, then EmailJS)
    sendReceiptEmail(formData, orderNumber, pdfBlob, pdfBase64);
    
    // Store receipt data in localStorage for reference
    const receiptData = {
        orderNumber: orderNumber,
        data: formData,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    let receipts = JSON.parse(localStorage.getItem('divineCareReceipts') || '[]');
    receipts.push(receiptData);
    localStorage.setItem('divineCareReceipts', JSON.stringify(receipts));
}

function sendReceiptEmail(formData, orderNumber, pdfBlob, pdfBase64) {
    // Try backend server first (for PDF attachments)
    sendViaBackend(formData, orderNumber, pdfBase64)
        .then(success => {
            if (success) {
                updateEmailStatus(true, formData.email);
            } else {
                // Fallback to EmailJS if backend not available
                sendViaEmailJS(formData, orderNumber);
            }
        })
        .catch(() => {
            // Fallback to EmailJS if backend fails
            sendViaEmailJS(formData, orderNumber);
        });
}

function sendViaBackend(formData, orderNumber, pdfBase64) {
    return new Promise((resolve) => {
        // Try to send via backend server
        fetch('http://localhost:3000/send-receipt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                formData: formData,
                orderNumber: orderNumber,
                pdfBase64: pdfBase64
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Email sent via backend server:', data.messageId);
                resolve(true);
            } else {
                resolve(false);
            }
        })
        .catch(error => {
            console.log('Backend server not available, trying EmailJS...');
            resolve(false);
        });
    });
}

function sendViaEmailJS(formData, orderNumber) {
    // Check if EmailJS is configured and enabled
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS library not loaded! Make sure the script is included in HTML.');
        updateEmailStatus(false, formData.email);
        return;
    }
    
    if (!window.EMAILJS_CONFIG) {
        console.error('❌ EmailJS config not found!');
        updateEmailStatus(false, formData.email);
        return;
    }
    
    if (!window.EMAILJS_CONFIG.enabled) {
        console.warn('⚠️ EmailJS is disabled in config. Set enabled: true in emailjs-config.js');
        updateEmailStatus(false, formData.email);
        return;
    }
    
    if (!window.EMAILJS_CONFIG.serviceId || !window.EMAILJS_CONFIG.templateId || !window.EMAILJS_CONFIG.publicKey) {
        console.error('❌ EmailJS config incomplete! Check serviceId, templateId, and publicKey.');
        updateEmailStatus(false, formData.email);
        return;
    }
    
    // All checks passed, proceed with sending
    console.log('✅ All EmailJS checks passed, proceeding to send email...');
        // Prepare email content - format services list for EmailJS template
        const servicesList = formData.services.map((s) => {
            const allServices = [...services.normal, ...services.therapy];
            const service = allServices.find(svc => svc.id === s.id);
            const name = service ? service.name : s.id;
            return `${name} - ₹${s.price}${s.price === 1500 ? '+' : ''}`;
        }).join('\n'); // Use actual newline for EmailJS template

        // Create email template parameters - MUST match template variable names exactly!
        const emailParams = {
            email: formData.email,  // Template expects "email" not "to_email"
            to_name: formData.name,
            order_number: orderNumber,
            patient_name: formData.name,
            patient_age: formData.age,
            patient_gender: formData.gender,
            patient_phone: formData.phone,
            appointment_date: formatDate(formData.date),
            consultation_mode: formData.mode === 'online' ? 'Online Consultation' : 'Offline Consultation',
            timing: formData.timing || 'N/A',
            services_list: servicesList,
            total_amount: `₹${formData.totalAmount}`
        };

        // Make sure EmailJS is initialized (init is a function, so check if it exists)
        try {
            if (emailjs && emailjs.init && typeof emailjs.init === 'function') {
                emailjs.init(window.EMAILJS_CONFIG.publicKey);
                console.log('✅ EmailJS initialized with public key');
            }
        } catch (e) {
            console.warn('EmailJS initialization check:', e.message || e);
        }

        // Send email using EmailJS
        console.log('📧 Attempting to send email...');
        console.log('Service ID:', window.EMAILJS_CONFIG.serviceId);
        console.log('Template ID:', window.EMAILJS_CONFIG.templateId);
        console.log('Parameters:', emailParams);
        
        emailjs.send(
            window.EMAILJS_CONFIG.serviceId, 
            window.EMAILJS_CONFIG.templateId, 
            emailParams
        )
        .then(function(response) {
            console.log('✅ Email sent successfully!');
            console.log('Response status:', response.status);
            console.log('Response text:', response.text);
            updateEmailStatus(true, formData.email);
        }, function(error) {
            console.error('❌ Email sending failed!');
            console.error('Error:', error);
            if (error.text) {
                console.error('Error text:', error.text);
            }
            console.error('Full error details:', JSON.stringify(error, null, 2));
            updateEmailStatus(false, formData.email);
        });
}

function updateEmailStatus(success, email) {
    const receiptDetails = document.getElementById('receiptDetails');
    if (!receiptDetails) return;
    
    let statusDiv = receiptDetails.querySelector('.email-status');
    
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.className = 'email-status';
    }
    
    if (success) {
        statusDiv.style.cssText = 'margin-top: 20px; padding: 15px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 5px; color: #155724;';
        statusDiv.innerHTML = `
            <strong>✅ Email Sent Successfully!</strong><br>
            Your receipt has been sent to <strong>${email}</strong> from <strong>divinecare.psychologist@gmail.com</strong><br>
            Please check your inbox (and spam folder) for the receipt.
        `;
    } else {
        statusDiv.style.cssText = 'margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px; color: #856404;';
        statusDiv.innerHTML = `
            <strong>📧 Email Setup Required</strong><br>
            PDF receipt has been downloaded successfully! ✅<br><br>
            To enable automatic email sending to <strong>${email}</strong> from <strong>divinecare.psychologist@gmail.com</strong>:<br>
            <strong>Quick Setup (5 minutes):</strong> See <code>QUICK_EMAIL_SETUP.md</code> for EmailJS setup instructions<br>
            <strong>Alternative:</strong> Install Node.js and use backend server (see <code>EMAIL_SETUP.md</code>)
        `;
    }
    
    if (!receiptDetails.querySelector('.email-status')) {
        receiptDetails.appendChild(statusDiv);
    }
}

