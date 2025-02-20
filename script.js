// ✅ Use Firebase v8 (No import/export needed)
var firebaseConfig = {
    apiKey: "AIzaSyC8950UoLWJ_-mL2h8qXrAfjV6KLtSYano",
    authDomain: "divine-appointements.firebaseapp.com",
    projectId: "divine-appointements",
    storageBucket: "divine-appointements.appspot.com",
    messagingSenderId: "352266934809",
    appId: "1:352266934809:web:3e99cd5fac7e044586a888",
    measurementId: "G-B9RPR118N2"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// ✅ Form Submission Handler
document.getElementById("appointmentForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    let fullName = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let date = document.getElementById("date").value;
    let service = document.getElementById("service").value;
    let mode = document.getElementById("mode").value;
    let message = document.getElementById("message").value;

    // ✅ If "Online" mode is selected, proceed to PhonePe Payment
    if (mode === "Online") {
        let confirmPayment = confirm("You need to pay ₹500. Click OK to proceed to payment.");
        if (confirmPayment) {
            try {
                // ✅ Step 1: Prepare Payment Payload
                let payload = {
                    merchantId: "M22RWTTZRNM3V",  // Replace with your PhonePe UAT Merchant ID
                    transactionId: `TXN_${Date.now()}`,  // Unique Transaction ID
                    amount: 500 * 100,  // Convert ₹ to paise
                    callbackUrl: "https://divinecare.org.in/",
                    mobileNumber: phone,
                    paymentInstrument: {
                        type: "UPI_INTENT",
                        targetApp: "com.phonepe.app"  // Opens PhonePe App
                    }
                };

                // ✅ Step 2: Call PhonePe API to Initiate Payment
                let response = await fetch("https://api-preprod.phonepe.com/apis/pg-sandbox/v1/initiate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                let data = await response.json();

                // ✅ Step 3: Redirect User to PhonePe Payment Page
                if (data.success) {
                    window.location.href = data.data.instrumentResponse.redirectInfo.url;
                } else {
                    alert("⚠️ Payment Failed: " + data.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("⚠️ Unable to connect to PhonePe.");
            }
        }
    } else {
        // ✅ If Offline Payment, Save Data to Firebase Firestore
        db.collection("appointments").add({
            fullName: fullName,
            email: email,
            phone: phone,
            date: date,
            service: service,
            mode: mode,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("✅ Successfully booked appointment. You will receive a confirmation email.");
            window.location.href = "index.html";
        }).catch((error) => {
            alert("⚠️ Error submitting form.");
            console.error("Error:", error);
        });
    }
});
