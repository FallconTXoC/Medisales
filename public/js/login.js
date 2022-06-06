const socket = io();
let notifier = new AWN();

socket.on("signin", (data) => {
    if (data.success === true) {
        document.cookie = "token=" + data.token;
        window.location.href = `/`;
    } else notifier.alert(data.message);
});

$(`#signin`).click((event) => {
    console.log("click")
    event.preventDefault();
    const username = $(`#username`).val();
    const password = $(`#password`).val();
    if (!username || !username.match(/^[a-zA-Z.]+$/i)) {
        console.log("notif")
        return notifier.alert("Merci d'entrer un nom d'utilisateur valide.");
    }
    if (!password) notifier.alert("Merci d'entrer un mot de passe.");
    socket.emit(`signin`, {username, password});
});