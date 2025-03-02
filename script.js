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
const PAYU_MERCHANT_KEY = "pKjgw4";  
const PAYU_SALT = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDnCQ9+b0/6u2ywFP4L4o+Uy+QTalvOrOO6RLfqvu+bNi8a+r2LeaE+WTyQjpKfuI3EkYTJr7T6SC+iODBulK8tAp68GKu+ftHax3sl6MSkcDI9R4RyhsCbUh4BFV1a0sM+f94OVbvPA+E5i1iuaXlPrDB2LOWVdYPeopFC7SZNNVYG6a5oTWCSSH+AiZuRRGXNsrgmS3s7KPvFwNJqzUnwMfljCRiXlpImr+yEYjrdQgmSsTbCl52wT53LW7UjyBwGl+f35uENhdA1jzDQr1CbawiBw9brbs3nGsZYOxeCdljW11L2QHPfHjel6CGEPpkLlPWkn1W4fgIv4eQLi37VAgMBAAECggEASBaSqA/Rc9nBaxvRvSGfTX1lGA3Kwa0+jWNdw7h6CQMaJZ/xPrDf+BVeCXkDFSU/zwLc3RWfMa0Od95ydj6cfj3gC67i/9iQYGR373c2zFxZwLctA5M6S/yOciYZb/ptg3XgcrabmFeMkikBrcIpYQvIP0d5B26YjAJLswdOOS6AaMlNzC4IQ+nCeApMxnoR/VXyozlZqXLS5EIqajTNBlh1eZdTEVYiQLHyOTNjffpaaQyGZG3W3/UuKhu/93kxc3FOm7SV4uzlc8ap19eRp/7MOPssN7V9vAkF8kFeYsp6ci0JWzlC6thWAhDpKHJ4etlwA2VBLr5KV58Ok1wRLQKBgQD6cVXAjxSMtzsgS00u5s+Gvtq0q7kZwB+MDU+abeZt9lmpkEBCl89bZCax6D0BTWZV0dbnUsf+vMDdqG38+Lh+L3OCrQtdkfuAbysPM0s2QtC8p8RFE05osb1tuXmCOQmU5EPlHM9XlaqG2XN+dljMmCDg9BAnXq8Pig3Xg9qy6wKBgQDsKXr1gQpm12JFSKF60Kdd7rVciVTwb+Bbg4yKBRlYZmQGiW0NH9L8ovX1ALPVAVHDdab6IhpeJLGdQUnB/idNqTz7dQGgW36W0viix2ysEndD+tsJc6cxn7DsQ+CPPPhfsAgZWxFdIj1I/Iq65f3sbtKM77Bi983bjSk2gDilPwKBgQDDzujk7Pl8K6am0Tk/ema3S3Fj4P+QCo6fyah7bYHEZ+Aimw4jAt607dDzOEi6Q/HHF5GWuzpzCNEifRXBvBVDU4ZUnUdNmV2yRTi9YbVkb0kUt3bVKwsbABzDNUizcDT1nKMY9zWFnRb+5/VM4ur6y9apCym2HmlxFNdNsWHEkQKBgDomSJF00aPa+uaGaMR95ggaA+wiIJkHYx4FeTBu6vu6UnzNj92AbYopchh+sMkNBx3ytUe35/gwXs+SyN+Mfg8AUfS0rc7XWIc4sWIbaqW/8j/5378nDA8K/Bxg5kU+xQWCqavcoZzmFmMHU/2LLgfujceIKU1lKPobev9heREvAoGBAPR0PRTfPL+9q4SlDG5hbAjPazjK+PeYO6kuE24DCUo5Mnc8XGWsU3YahjTMkc7Flr1vxXvR1KTT99qsUgtGcko/q6wHB+vjAEhFMCNiedyoqaXho4C7nv1uLZC40XDCUgmduX5P2sdFIvmjV9eF77tOLu2pDh4YQMC0//tAJfGx"; // Your Salt Key (truncated for security)
const PAYU_URL = "https://test.payu.in/_payment"; 

// ✅ Generate PayU Hash via Render Service
async function getPayUHash(txnid, amount, productinfo, firstname, email) {
    try {
        const response = await fetch("https://payu-hash-generator.onrender.com/generateHash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                key: PAYU_MERCHANT_KEY, txnid, amount, productinfo, firstname, email, salt: PAYU_SALT 
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

    if (mode === "Online") {
        if (!confirm("You need to pay ₹500. Click OK to proceed to payment.")) return;

        let txnid = "TXN" + Date.now(); // Unique transaction ID

        let hash = await getPayUHash(txnid, amount, service, fullName, email);
        if (!hash) return;

        // ✅ Create and Submit PayU Payment Form
        let form = document.createElement("form");
        form.method = "POST";
        form.action = PAYU_URL;

        let payUData = {
            key: PAYU_MERCHANT_KEY, txnid, amount, productinfo: service, 
            firstname: fullName, email, phone, 
            surl: "https://divinecare.org.in/payment-success.html",
            furl: "https://divinecare.org.in/payment-failure.html",
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
            fullName, email, phone, date, service, mode, message,
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
