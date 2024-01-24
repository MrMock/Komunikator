function setupWebSocket(accessToken) {
    var hostUrl = "wss://webapp-oiihp.ondigitalocean.app/socket.io/";
    var socket = new WebSocket(hostUrl + '?access-token=' + accessToken + "&EIO=4&transport=websocket");

    socket.onopen = function(event) {
        console.log("Połączono z WebSocket.");
    };

    socket.onmessage = function(event) {
        console.log("Otrzymano wiadomość: " + event.data);
    };

    socket.onerror = function(error) {
        console.error("Błąd WebSocket: ", error);
    };

    socket.onclose = function(event) {
        console.log("Połączenie WebSocket zamknięte.");
    };
}

function fetchPublicChannels() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://webapp-oiihp.ondigitalocean.app/api/channels/public", true);
    xhr.setRequestHeader("x-access-token", accessToken);
	
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                try {
                    var channels = JSON.parse(xhr.responseText);
                    displayChannels(channels, 'publicChannels');
                } catch (e) {
                    console.error("Błąd podczas przetwarzania odpowiedzi JSON: ", e);
                }
            } else {
                console.error("Błąd przy pobieraniu kanałów publicznych: ", xhr.status, xhr.responseText);
            }
        }
    };
    xhr.send();
}

function displayChannels(channelsData, containerId) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';

    channelsData.channels.forEach(function(channel) {
        // Utworzenie przycisku dla każdego kanału
        var channelButton = document.createElement('button');
        channelButton.textContent = channel.name;
        channelButton.classList.add('channel-button');
        channelButton.setAttribute('data-channel-id', channel.id);

        // Dodanie obsługi zdarzenia kliknięcia
        channelButton.addEventListener('click', function() {
            selectChannel(channel.id);
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
    var accessToken = localStorage.getItem('accessToken'); // lub inny sposób pobrania tokenu
    setupWebSocket(accessToken);
	fetchUserChannels();
    fetchPublicChannels();  // Wywołanie funkcji fetchPublicChannels po załadowaniu strony
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
    // Usuń zaznaczenie ze wszystkich kanałów
    var allSelectedChannels = document.querySelectorAll('.channel-button.selected');
    allSelectedChannels.forEach(function(channel) {
        channel.classList.remove('selected');
    });

    // Zaznacz aktualnie wybrany kanał
    var selector = isPublicChannel ? '.public-channel' : '.user-channel';
    var selectedChannel = document.querySelector(selector + '[data-channel-id="' + channelId + '"]');
    if (selectedChannel) {
        selectedChannel.classList.add('selected');
    }

    // Ukryj przycisk "Opuść kanał" i wyświetl przycisk "Kopiuj ID kanału"
    if (isPublicChannel) {
        document.getElementById('leaveChannelButton').style.display = 'none';
        document.getElementById('copyChannelIdButton').style.display = 'block';
        currentPublicChannelId = channelId; // Zapisz ID publicznego kanału
    }

    console.log("Wybrany kanał: " + channelId);
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