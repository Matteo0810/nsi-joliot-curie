function Notification(title) {
    this._title = title
    this._send()
}

Notification.prototype._send = function() {
    document.body.insertAdjacentHTML('beforeend', `
        <div class="notification">
            <h4>${this._title}</h4>
            <span id="close">&times;</span>
        </div>
    `)

    document.getElementById('close')
        .addEventListener('click', this.close)
}

Notification.prototype.close = function() {
    const node = document.querySelector('.notification')
    node.style.animation = "notification-off .3s alternate";
    setTimeout(() => node.remove(), 2.5e2)
}

let notification = null
function sendNotification(title) {
    if(notification)
        notification.close()
    notification = new Notification(title)
}