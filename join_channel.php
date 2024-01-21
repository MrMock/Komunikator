<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Odebranie danych JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);

    $channelId = $input['channelId'];
    $password = $input['password'];

    // Tutaj należy dodać logikę dołączania do kanału, na przykład wysyłając te dane do innego serwera/API
    // ...

    echo "Dołączono do kanału: " . $channelId; // Przykładowa odpowiedź
}
?>