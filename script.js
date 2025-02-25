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

// ✅ PayU Credentials
const PAYU_MERCHANT_KEY = "b1n0dl";  // Your Merchant Key
const PAYU_SALT = "vLrmUcy3mM2pLBbncMQJBsK4YOcKJ3HB"; // Your Salt Key
const PAYU_URL = "https://secure.payu.in/_payment"; // Live URL

// ✅ Function to Generate PayU Hash via Render Deployed Service
async function getPayUHash(txnid, amount, productinfo, firstname, email) {
    try {
        const response = await fetch("https://payu-hash-generator.onrender.com/generateHash", { // ✅ Updated URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                key: PAYU_MERCHANT_KEY,
                txnid: txnid,
                amount: amount,
                productinfo: productinfo,
                firstname: firstname,
                email: email,
                salt: PAYU_SALT
            })
        });

        const data = await response.json();
        return data.hash;
    } catch (error) {
        console.error("⚠️ Error generating hash:", error);
        alert("❌ Payment error: Unable to generate hash. Please try again.");
        return null;
    }
}

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
    let amount = 500; // Fixed amount ₹500

    // ✅ If "Online" mode is selected, proceed to PayU Payment
    if (mode === "Online") {
        let confirmPayment = confirm("You need to pay ₹500. Click OK to proceed to payment.");
        if (confirmPayment) {
            let txnid = "TXN" + Date.now(); // Unique transaction ID

            // ✅ Step 1: Generate PayU Hash
            let hash = await getPayUHash(txnid, amount, service, fullName, email);
            if (!hash) return; // If hash generation fails, stop here.

            // ✅ Step 2: Create a Hidden Form and Submit to PayU
            let form = document.createElement("form");
            form.method = "POST";
            form.action = PAYU_URL;

            let inputs = {
                key: PAYU_MERCHANT_KEY,
                txnid: txnid,
                amount: amount,
                productinfo: service,
                firstname: fullName,
                email: email,
                phone: phone,
                surl: "https://divinecare.org.in/payment-success.html",
                furl: "https://divinecare.org.in/payment-failure.html",
                hash: hash
            };

            for (let key in inputs) {
                let input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = inputs[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
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
