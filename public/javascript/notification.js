function Notification(title) {
    this._title = title
    this._send()
}

Notification.prototype._send = function() {
    document.body.insertAdjacentHTML('beforeend', `
        <div class="notification">
            <h4>${this._title}</h4>
            <span class="close__notification">&times;</span>
        </div>
    `)

    document.querySelector('.close__notification')
        .onclick = () => this.close()
}

Notification.prototype.close = function() {
    const node = document.querySelector('.notification')
    if(!node) return
    node.style.animation = "notification-off .3s alternate";
    setTimeout(() => node.remove(), 2.5e2)
}

let notification = null
function sendNotification(title) {
    if(notification)
        notification.close()
    notification = new Notification(title)
}