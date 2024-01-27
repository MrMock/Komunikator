var username = "kamil";
var hostUrl = "wss://webapp-oiihp.ondigitalocean.app";
var socket;
var currentChannelId, currentPublicChannelId;

function setupWebSocket() {
    // Tworzenie URL z uwzględnieniem tokena dostępu i innych parametrów
    var wsUrl = hostUrl + '/socket.io/?access-token=' + accessToken + '&EIO=4&transport=websocket';

    socket = new WebSocket(wsUrl);

    socket.onopen = function(event) {
        console.log('Połączono z WebSocket.');
    };

socket.onmessage = function(event) {
    try {
        if (event.data && typeof event.data === 'string' && event.data.startsWith('{')) {
            var receivedMessage = JSON.parse(event.data);
            if (receivedMessage.room === currentChannelId) {
                displayReceivedMessage(receivedMessage);
            }
        }
    } catch (e) {
        console.error('Błąd podczas przetwarzania wiadomości WebSocket: ', e);
    }
};

    socket.onerror = function(error) {
        console.error('Błąd WebSocket: ', error);
    };

socket.onclose = function(event) {
    console.log('Połączenie WebSocket zamknięte. Próba ponownego połączenia...');
    setTimeout(function() {
        setupWebSocket();
    }, 500); // Oczekiwanie 5 sekund przed ponowną próbą połączenia
};
}



function fetchPublicChannels() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://webapp-oiihp.ondigitalocean.app/api/channels/public", true);
    xhr.setRequestHeader("x-access-token", accessToken);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var channels = JSON.parse(xhr.responseText);
            displayChannels(channels, 'publicChannels');
        }
    };
    xhr.send();
}

function displayChannels(channelsData, containerId) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';
    channelsData.channels.forEach(function(channel) {
        var channelButton = document.createElement('button');
        channelButton.textContent = channel.name;
        channelButton.classList.add('channel-button');
        channelButton.setAttribute('data-channel-id', channel.id);
        channelButton.addEventListener('click', function() {
            selectChannel(channel.id, containerId === 'publicChannels');
        });
        container.appendChild(channelButton);
    });
}

function displayChannels(channelsData, containerId) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';
    var isPublicChannel = containerId === 'publicChannels';

    channelsData.channels.forEach(function(channel) {
        var channelButton = document.createElement('button');
        channelButton.textContent = channel.name;
        channelButton.classList.add('channel-button', isPublicChannel ? 'public-channel' : 'user-channel');
        channelButton.setAttribute('data-channel-id', channel.id);

        channelButton.addEventListener('click', function() {
            if (isPublicChannel) {
                selectChannel(channel.id, true);
            } else {
                selectUserChannel(channel.id);
            }
        });

        container.appendChild(channelButton);
    });
}


document.addEventListener("DOMContentLoaded", function() {
    if (accessToken) {
        setupWebSocket();
        fetchUserChannels(accessToken);
        fetchPublicChannels(accessToken);
    } else {
        console.error('Brak tokenu dostępu');
    }

    var sendMessageButton = document.getElementById('sendMessageBtn');
    if (sendMessageButton) {
        sendMessageButton.addEventListener('click', sendMessage);
    }
});


function selectPublicChannel(channelId) {
    // Usuń zaznaczenie z poprzednio wybranego publicznego kanału
    var previouslySelectedPublic = document.querySelector('.public-channel.selected');
    if (previouslySelectedPublic) {
        previouslySelectedPublic.classList.remove('selected');
    }

    // Zaznacz aktualnie wybrany publiczny kanał
    var selectedPublicChannel = document.querySelector('.public-channel[data-channel-id="' + channelId + '"]');
    if (selectedPublicChannel) {
        selectedPublicChannel.classList.add('selected');
    }
	    document.getElementById('messagesDisplay').innerHTML = ''; // Czyszczenie wiadomości
    fetchChannelMessages(channelId);
	fetchChannelMessages(channelId);
}

function selectUserChannel(channelId) {
    // Usuń zaznaczenie z poprzednio wybranego kanału użytkownika
    var previouslySelected = document.querySelector('.user-channel.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // Zaznacz aktualnie wybrany kanał użytkownika
    var selectedChannel = document.querySelector('.user-channel[data-channel-id="' + channelId + '"]');
    if (selectedChannel) {
        selectedChannel.classList.add('selected');
    }


	var selectedChannel = document.querySelector('.user-channel[data-channel-id="' + channelId + '"]');
    if (selectedChannel) {
        selectedChannel.classList.add('selected');
    }
	    document.getElementById('messagesDisplay').innerHTML = ''; // Czyszczenie wiadomości
    fetchChannelMessages(channelId);
	 fetchChannelMessages(channelId);
    // Wyświetl przycisk "Opuść kanał" i ukryj przycisk "Kopiuj ID kanału"
    document.getElementById('leaveChannelButton').style.display = 'block';
    document.getElementById('copyChannelIdButton').style.display = 'none';
    currentChannelId = channelId; // Zapisz ID wybranego kanału użytkownika
}

function fetchUserChannels() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://webapp-oiihp.ondigitalocean.app/api/channels/user", true);
    xhr.setRequestHeader("x-access-token", accessToken);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                try {
                    var channels = JSON.parse(xhr.responseText);
                    displayChannels(channels, 'userChannels');
                } catch (e) {
                    console.error("Błąd podczas przetwarzania odpowiedzi JSON: ", e);
                }
            } else {
                console.error("Błąd przy pobieraniu kanałów użytkownika: ", xhr.status, xhr.responseText);
            }
        }
    };
    xhr.send();
}

function joinChannel() {
    var channelId = document.getElementById('channelId').value;
    var channelPassword = document.getElementById('channelPassword').value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://webapp-oiihp.ondigitalocean.app/api/channels/join", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-access-token", accessToken);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log("Dołączono do kanału");
                // Czyszczenie formularza
                document.getElementById('channelId').value = '';
                document.getElementById('channelPassword').value = '';
                // Odświeżanie listy kanałów użytkownika
                fetchUserChannels();
            } else {
                console.error("Błąd przy dołączaniu do kanału: ", xhr.status, xhr.responseText);
            }
        }
    };

    var data = JSON.stringify({
        channelId: channelId,
        password: channelPassword
    });

    xhr.send(data);
}

function selectChannel(channelId, isPublicChannel) {
    var selectedChannelClass = isPublicChannel ? '.public-channel' : '.user-channel';
    var allSelectedChannels = document.querySelectorAll('.channel-button.selected');
    allSelectedChannels.forEach(function(channel) {
        channel.classList.remove('selected');
    });

    var selectedChannel = document.querySelector(selectedChannelClass + '[data-channel-id="' + channelId + '"]');
    if (selectedChannel) {
        selectedChannel.classList.add('selected');
    }

    currentChannelId = channelId;
    document.getElementById('messagesDisplay').innerHTML = '';
    fetchChannelMessages(channelId);

    var displayState = isPublicChannel ? 'none' : 'block';
    document.getElementById('leaveChannelButton').style.display = displayState;
}
function leaveChannel() {
    if (!currentChannelId) {
        console.error("Nie wybrano żadnego kanału");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://webapp-oiihp.ondigitalocean.app/api/channels/leave?channelId=" + currentChannelId, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-access-token", accessToken);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log("Opuściliśmy kanał");
                currentChannelId = null;
                document.getElementById('leaveChannelButton').style.display = 'none';
                fetchUserChannels();
            } else {
                console.error("Błąd przy opuszczaniu kanału: ", xhr.status, xhr.responseText);
            }
        }
    };

    xhr.send();
}

function copyChannelId() {
    if (currentPublicChannelId) {
        var channelIdInput = document.getElementById('channelId');
        channelIdInput.value = currentPublicChannelId;
    }
}

function fetchChannelMessages(channelId) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://webapp-oiihp.ondigitalocean.app/api/channels/channelMessages?channelId=" + channelId, true);
    xhr.setRequestHeader("x-access-token", accessToken);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(response); // Logowanie odpowiedzi serwera
                if (response.messages) {
                    displayMessages(response.messages); // Załóżmy, że odpowiedź zawiera pole 'messages'
                } else {
                    console.error("Odpowiedź serwera nie zawiera pola 'messages'");
                }
            } else {
                console.error("Błąd przy pobieraniu wiadomości: ", xhr.status, xhr.responseText);
            }
        }
    };
    xhr.send();
}

function displayMessages(messages) {
    var messagesContainer = document.getElementById('messagesDisplay');
    messagesContainer.innerHTML = '';

    if (Array.isArray(messages)) {
        messages.forEach(function(message) {
            var messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.innerHTML = 
                '<div class="message-sender">Nadawca: ' + message.sender + '</div>' +
                '<div class="message-date">' + new Date(message.createdAt).toLocaleString() + '</div>' +
                '<div class="message-content">' + message.content + '</div>';
            messagesContainer.appendChild(messageDiv);
        });
    } else {
        console.error("Otrzymane dane nie są tablicą: ", messages);
    }
}


function sendMessage() {
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value;

    if (socket.readyState === WebSocket.OPEN && message && currentChannelId) {
        var messageData = {
            username: username,
            message: message,
            createdAt: new Date().toString(),
            room: currentChannelId
        };

        socket.send(JSON.stringify(messageData));
        messageInput.value = '';
        console.log("Wysyłany JSON:", messageData);
    } else if (socket.readyState !== WebSocket.OPEN) {
        console.error("Połączenie WebSocket nie jest otwarte.");
    } else {
        console.error("Wiadomość jest pusta lub nie wybrano kanału.");
    }
}
function displayReceivedMessage(message) {
    var messagesContainer = document.getElementById('messagesDisplay');
    var messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = 
        '<div class="message-sender">Nadawca: ' + message.username + '</div>' +
        '<div class="message-date">' + new Date(message.createdAt).toLocaleString() + '</div>' +
        '<div class="message-content">' + message.content + '</div>';
    messagesContainer.appendChild(messageDiv);
}