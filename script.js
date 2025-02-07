document.getElementById("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    let formData = {
        fullName: document.getElementById("full-name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        date: document.getElementById("date").value,
        service: document.getElementById("service").value,
        mode: document.getElementById("mode").value,
        message: document.getElementById("message").value
    };

    let scriptURL = "https://script.google.com/macros/s/AKfycbyMfPwOb9DSGk1Ok-2xyjkglYLjW4BTxZmiM2iXfdwOD_eegP4M-tKyHjuw0vrxcw/exec"; // Replace with new Google Apps Script URL

    fetch(scriptURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        mode: "cors"
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("✅ Appointment booked successfully!");
            document.getElementById("appointmentForm").reset();
        } else {
            alert("❌ Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("❌ Fetch Error:", error);
        alert("⚠️ Failed to book appointment. Please try again.");
    });
});
