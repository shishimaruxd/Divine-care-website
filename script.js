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
document.getElementById("confirm-btn").addEventListener("click", function(event) {
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

    // ✅ Save Data to Firebase Firestore
    db.collection("appointments").add({
        fullName,
        email,
        phone,
        date,
        service,
        mode,
        message,
        price,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("✅ Appointment booked successfully! You will receive a confirmation email.");
        window.location.href = "index.html";
    }).catch(error => {
        alert("⚠️ Error submitting form. Please try again.");
        console.error("Error:", error);
    });
});
