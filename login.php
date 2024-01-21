<?php
session_start();

// URL API
$url = 'https://webapp-oiihp.ondigitalocean.app/api/auth/signin';

// Dane z formularza
$data = array(
    'username' => $_POST['username'],
    'password' => $_POST['password']
);

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

// Sprawdzenie odpowiedzi serwera
if (isset($responseData['message']) && count($responseData) == 1) {
    // Jeśli odpowiedź zawiera tylko 'message'
    $_SESSION['error_message'] = $responseData['message'];
    header('Location: index.php');
    exit;
} elseif (isset($responseData['id'])) {
    // Zapisz token dostępu do sesji
    $_SESSION['access_token'] = $responseData['accessToken'];

    // Przekierowanie na welcome.php
    header('Location: welcome.php');
    exit;
} else {
    // Ogólny komunikat o błędzie
    $_SESSION['error_message'] = 'Wystąpił nieznany błąd podczas logowania';
    header('Location: index.php');
    exit;
}
?>