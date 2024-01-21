var accessToken; // Zmienna globalna

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

document.addEventListener("DOMContentLoaded", function() {
    accessToken = getCookie('PHPSESSID'); // Przypisanie wartości do zmiennej globalnej
    setupWebSocket(accessToken);
    fetchPublicChannels();
});

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
    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);

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
        container.innerHTML += '<p>' + channel.name + ' (ID: ' + channel.id + ')</p>';
    });
}