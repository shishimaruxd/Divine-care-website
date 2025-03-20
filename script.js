// ✅ Firebase v8 Configuration
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

// ✅ PayU Credentials
const PAYU_MERCHANT_KEY = "b1n0dl";  
const PAYU_SALT = "g13SQQHh2IOLuI6bPBjrobBbO0Qi9b6i"; // ✅ Fixed syntax error
const PAYU_URL = "https://pmny.in/Xry6D4hOdhpc"; 

// ✅ Generate PayU Hash via Render Service
async function getPayUHash(txnid, amount, productinfo, firstname, email) {
    try {
        const response = await fetch("https://payu-hash-generator.onrender.com/generateHash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                key: PAYU_MERCHANT_KEY, 
                txnid, 
                amount, 
                productinfo, 
                firstname, 
                email, 
                salt: PAYU_SALT 
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.hash) {
            throw new Error("Hash generation failed. No hash returned.");

        return data.hash;
    } catch (error) {
        console.error("⚠️ Error generating hash:", error);
        alert("❌ Payment error: Unable to generate hash. Please try again.");
        return null;
    }
}

// ✅ Handle Form Submission
document.getElementById("appointmentForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let date = document.getElementById("date").value;
    let service = document.getElementById("service").value;
    let mode = document.getElementById("mode").value;
    let message = document.getElementById("message").value.trim();
    let amount = 500; // Fixed ₹500 amount

    if (!fullName || !email || !phone || !date || !service || !mode) {
        alert("⚠️ Please fill in all required fields.");
        return;
    }

    if (mode === "Online") {
        if (!confirm("You need to pay ₹500. Click OK to proceed to payment.")) return;

        let txnid = "TXN" + Date.now(); // Unique transaction ID

        let hash = await getPayUHash(txnid, amount, service, fullName, email);
        if (!hash) {
            alert("❌ Payment initialization failed. Please try again.");
            return;
        }

        // ✅ Create and Submit PayU Payment Form
        let form = document.createElement("form");
        form.method = "POST";
        form.action = PAYU_URL;

        let payUData = {
            key: PAYU_MERCHANT_KEY, 
            txnid, 
            amount, 
            productinfo: service, 
            firstname: fullName, 
            email, 
            phone, 
            surl: "https://divinecare.org.in/payment-success.html", // Success URL
            furl: "https://divinecare.org.in/payment-failure.html", // Failure URL
            hash
        };

        Object.keys(payUData).forEach(key => {
            let input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = payUData[key];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    } else {
        // ✅ Save Offline Payment Data to Firebase Firestore
        db.collection("appointments").add({
            fullName, 
            email, 
            phone, 
            date, 
            service, 
            mode, 
            message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("✅ Appointment booked successfully! You will receive a confirmation email.");
            window.location.href = "index.html";
        }).catch(error => {
            alert("⚠️ Error submitting form. Please try again.");
            console.error("Error:", error);
        });
    }
});
