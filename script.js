// ✅ Firebase Configuration
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

// ✅ Update Price on Service Selection
function updatePrice() {
    let serviceSelect = document.getElementById("service");
    let priceDisplay = document.getElementById("price");
    let selectedPrice = serviceSelect.value;
    priceDisplay.innerHTML = "Price: ₹" + selectedPrice;
}

// ✅ Handle Form Submission
document.getElementById("confirm-btn").addEventListener("click", async function(event) {
    event.preventDefault();

    let fullName = document.getElementById("full-name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let date = document.getElementById("date").value;
    let service = document.getElementById("service").options[document.getElementById("service").selectedIndex].text;
    let mode = document.getElementById("mode").value;
    let message = document.getElementById("message").value.trim();
    let price = document.getElementById("service").value;

    if (!fullName || !email || !phone || !date || !service || !mode) {
        alert("⚠️ Please fill in all required fields.");
        return;
    }

    // ✅ Save to Firestore
    try {
        await db.collection("appointments").add({
            fullName,
            email,
            phone,
            date,
            service,
            mode,
            message,
            price,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("✅ Appointment saved to Firestore.");
    } catch (error) {
        alert("⚠️ Error saving appointment. Please try again.");
        console.error("Firestore Error:", error);
        return;
    }

    // ✅ PayU Payment Integration
    let txnid = "TXN" + Date.now();
    let hashData = {
        key: "iQwXv8",
        txnid,
        amount: price,
        productinfo: "Appointment",
        firstname: fullName,
        email
    };

    try {
        const response = await fetch("https://payu-backend-sur6.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hashData)
        });

        const result = await response.json();

        if (!result.hash) {
            alert("❌ Could not fetch payment hash. Please try again.");
            return;
        }

        // ✅ Fill PayU Form
        document.getElementById("payu_txnid").value = txnid;
        document.getElementById("payu_amount").value = price;
        document.getElementById("payu_firstname").value = fullName;
        document.getElementById("payu_email").value = email;
        document.getElementById("payu_phone").value = phone;
        document.getElementById("payu_hash").value = result.hash;

        // ✅ Submit to PayU
        document.getElementById("payuForm").submit();

    } catch (error) {
        alert("❌ Error communicating with server. Try again later.");
        console.error("Hash fetch error:", error);
    }
});
