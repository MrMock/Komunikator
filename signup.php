<?php
session_start();

// URL API do rejestracji
$url = 'https://webapp-oiihp.ondigitalocean.app/api/auth/signup'; // Zmień na właściwy URL

// Dane z formularza
$data = array(
    'username' => $_POST['username'],
    'email' => $_POST['email'],
    'password' => $_POST['password']
);

// Sprawdzenie zgodności haseł
if ($_POST['password'] !== $_POST['confirm_password']) {
    $_SESSION['error_message'] = 'Hasła nie są zgodne.';
    header('Location: registration.php');
    exit;
}

// Inicjalizacja cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

// Wykonanie zapytania i otrzymanie odpowiedzi
$response = curl_exec($ch);

curl_close($ch);

// Dekodowanie odpowiedzi JSON
$responseData = json_decode($response, true);
echo $responseData;

// Sprawdzenie odpowiedzi serwera
if (isset($responseData['message'])) {
    // Jeśli serwer zwraca 'message'
    $_SESSION['error_message'] = $responseData['message'];
    header('Location: registration.php');
    exit;
}

header('Location: index.php');
exit;
?>