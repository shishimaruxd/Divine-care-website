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
        // ✅ Redirect to PayU after Firestore save
        redirectToPayU({
            fullName,
            email,
            phone,
            price,
            service
        });
    }).catch(error => {
        alert("⚠️ Error submitting form. Please try again.");
        console.error("Error:", error);
    });
});

// ✅ Redirect to PayU
function redirectToPayU(data) {
    let form = document.createElement("form");
    form.action = "https://secure.payu.in/_payment";  // Production PayU URL
    form.method = "POST";

    let fields = {
        key: "REPLACE_WITH_YOUR_KEY",   // Replace with your Merchant Key
        txnid: "Txn" + Date.now(),
        amount: data.price,
        productinfo: data.service,
        firstname: data.fullName,
        email: data.email,
        phone: data.phone,
        surl: "https://divinecarepayu.infinityfreeapp.com/success.html",
        furl: "https://divinecarepayu.infinityfreeapp.com/failure.html",
        service_provider: "payu_paisa"
    };

    fetch("https://divinecarepayu.byethost10.com/generate_hash.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(fields)
    })
    .then(response => response.json())
    .then(result => {
        fields.hash = result.hash;

        for (let key in fields) {
            let input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    })
    .catch(error => {
        alert("⚠️ Payment setup failed. Please try again.");
        console.error("Error:", error);
    });
}
