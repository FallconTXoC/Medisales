const socket = io();
import NotificationPopup from './notification-popup.js';

socket.on("signin", (data) => {
    if (data.success === true) {
        document.cookie = "token=" + data.token;
        window.location.href = `/`;
    } else
        new NotificationPopup(`Erreur de connexion`, `Echec de l'authentification`, data.message, `error`).show();
});

$(`#signin`).click((event) => {
    console.log("click")
    event.preventDefault();
    const username = $(`#username`).val();
    const password = $(`#password`).val();
    if (!username || !username.match(/^[a-zA-Z.]+$/i)) {
        console.log("notif")
        return new NotificationPopup(`Erreur de connexion`, `Echec de l'authentification`, `Merci d'entrer un nom d'utilisateur valide.`, `error`).show();
    }
    if (!password) return new NotificationPopup(`Erreur de connexion`, `Echec de l'authentification`, `Merci d'entrer un mot de passe.`, `error`).show();
    socket.emit(`signin`, {username, password});
});