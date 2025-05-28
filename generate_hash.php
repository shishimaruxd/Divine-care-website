<?php
// Replace with your real PayU merchant key and salt
$MERCHANT_KEY = "b1n0dl";
$SALT = "g13SQQHh2IOLuI6bPBjrobBbO0Qi9b6i";

$txnid = $_POST["txnid"];
$amount = $_POST["amount"];
$productinfo = $_POST["productinfo"];
$firstname = $_POST["firstname"];
$email = $_POST["email"];

// Create hash string as per PayU format
$hash_string = "$MERCHANT_KEY|$txnid|$amount|$productinfo|$firstname|$email|||||||||||$SALT";
$hash = strtolower(hash('sha512', $hash_string));

echo json_encode(["hash" => $hash]);
?>
