export default class NotificationPopup {
    constructor(title, contentHeader, content, type) {
        this.title = title;
        this.contentHeader = contentHeader
        this.content = content;
        this.type = type;
    }

    show() {
        $(`.notification-popup-container`).append(`<div class="notification-popup ${this.type}">
            <div class="notification-popup-title">
                <h5>${this.title}</h5>
                <span class="material-icons">close</span>
            </div>
            <div class="notification-popup-content">
                <h5>${this.contentHeader}</h5>
                <p>${this.content}</p>
            </div>
        </div>`);
        let element = $(`.notification-popup-container .notification-popup:last-child`).show("fade", 300);
        element.find(`.notification-popup-title .material-icons`).click((event) => {
            element.hide("fade", 300);
        });
        setTimeout(() => {
            element.hide("fade", 300, () => {
                element.remove();
            });
        }, 5000);
    }
}