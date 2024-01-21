document.addEventListener("DOMContentLoaded", function(){
    const registrationForm = document.getElementById("registrationForm");
    registrationForm.addEventListener("submit", function(e){
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if(password !== confirmPassword){
            alert("Hasła nie są identyczne");
            e.preventDefault();
            return false;
        }

        if(password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)){
            alert("Hasło musi zawierać co najmniej 8 znaków, jedną wielką literę i jeden znak specjalny");
            e.preventDefault();
            return false;
        }

        return true;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    loadContacts();
});

function loadContacts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'getContacts.php', true);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('contactsSection').innerHTML = this.responseText;
        }
    };
    xhr.send();
}

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    const contactId = // Kod do pobrania ID wybranego kontaktu
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'sendMessage.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Kod do obsługi odpowiedzi, np. wyświetlenie potwierdzenia wysłania
        }
    };
    xhr.send('message=' + encodeURIComponent(message) + '&contactId=' + encodeURIComponent(contactId));
}

// Dodatkowe funkcje, np. do odświeżania wiadomości