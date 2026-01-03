// EmailJS Configuration
// 
// QUICK SETUP (Choose ONE option):
//
// OPTION A: Use Backend Server (RECOMMENDED - Supports PDF attachments)
//   1. Open terminal in project folder
//   2. Run: npm install
//   3. Edit server.js - Add your Gmail App Password
//   4. Run: node server.js
//   5. Keep server running when booking appointments
//
// OPTION B: Use EmailJS (Email only, no PDF attachment in free tier)
//   1. Go to https://www.emailjs.com/ and create a free account
//   2. Connect your Gmail account (divinecare.psychologist@gmail.com) 
//   3. Create an Email Service (Service Type: Gmail)
//   4. Create an Email Template with variables: {{to_name}}, {{to_email}}, {{order_number}}, etc.
//   5. Get your Service ID, Template ID, and Public Key
//   6. Update the values below and set enabled: true
//
// See EMAIL_SETUP.md for detailed instructions

const EMAILJS_CONFIG = {
    serviceId: 'service_bzuxcf3',        // Replace with your EmailJS service ID
    templateId: 'template_39sbeis',     // Replace with your EmailJS template ID
    publicKey: 'gB_0teeL01omke4rp',                // Replace with your EmailJS public key
    enabled: true                                 // ✅ ENABLED - Email sending is active!
};

// Initialize EmailJS
if (EMAILJS_CONFIG.enabled && typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

// Export configuration
if (typeof window !== 'undefined') {
    window.EMAILJS_CONFIG = EMAILJS_CONFIG;
}

