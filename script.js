document.getElementById("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    let formData = new FormData(this); // Get form data

    // Google Form URL (replace 'viewform' with 'formResponse')
    let googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSf4wFQRLsAVvOUrnhMAU2ZmiYHarl3RyUXSU5r-KMd8Fm6GHw/formResponse";

    fetch(googleFormURL, {
        method: "POST",
        mode: "no-cors",  // Ensures no CORS issue
        body: formData
    }).then(response => {
        alert("✅Thankyou for Booking Appointment with Divine Care! You will get confirmation mail under 30 minutes on given mail Id"); // Show success alert
        
        window.location.href = "index.html"; // Redirect to home page after alert
    }).catch(error => {
        alert("Error submitting form. Please Contact +918957604340 CALL US OR WHATSAPP US");
        console.error("Error:", error);
    });
});
