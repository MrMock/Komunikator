<?php
session_start();
?>
<DOCTYPE html>

<html>
<head>
 <script src="js/welcome.js"></script>
<link rel="stylesheet" type="text/css" href="css/welcome.css">
<title>Witaj w komunikatorze</title>
</head>
<body>
<div class="welcome-header">
    <button id="logoutBtn" class="action-button" onclick="window.location.href='logout.php'">Wyloguj</button>
</div>

<div id="mainContainer">

		<div id="channels" class="channels-container">
        <input type="text" id="channelId" placeholder="ID kanału">
        <input type="password" id="channelPassword" placeholder="Hasło kanału (opcjonalne)">
        <button onclick="joinChannel()">Dołącz do kanału</button>
		<div id="channels-left">
        <h3>Twoje kanały</h3>
        <div id="userChannels"></div>
        <h3>Kanały publiczne</h3>
        <div id="publicChannels"></div>
		</div></div>

	
    <div id="messagesSection" class="messages-container">
        <div id="messagesDisplay" class="messages-display">
            <!-- Tutaj pojawią się wiadomości -->
        </div>
        <textarea id="messageInput" class="message-input" placeholder="Wpisz wiadomość"></textarea>
        <button id="sendMessageBtn" class="action-button" onclick="sendMessage()">Wyślij</button>
    </div>

		
		<div id="contactsSection" class="contacts-container">
        <!-- Tutaj pojawi się lista kontaktów -->
    </div>
</div>
</html>
</body>
</html>