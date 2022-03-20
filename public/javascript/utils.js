const DEBUG = true

//TODO usless...
async function read(path, isJson = false) {
    try {
        const response = await fetch(`./static/${path}`, { method: 'GET' })
        return isJson ? response.json() : response.text()
    } catch {
        console.error('File not found.')
    }
}

function parseDate(timestamp) {
    const date = new Date(timestamp*1000);
    return `${date.toLocaleDateString()} à ${formatHours(date)}`
}

function formatHours(date) {
    const hours = formatUnit(date.getHours()),
        minutes = formatUnit(date.getMinutes()),
        seconds = formatUnit(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`
}

function formatUnit(unit) {
    return unit < 10 ? `0${unit}` : unit
}

function debug(message) {
    if(DEBUG)
        return console.log(`[DEBUG] <${new Date().toLocaleString().split(', ')
            .join(' ')}> ${message}`)
}

function clearInputs(...inputs) {
    inputs.map(input => input.value = '')
}

function validateForm(selector) {
    const fields = Object.values(document.querySelectorAll(selector)),
        goodFields = fields.filter(field => field.value.trim() !== ''),
        badFields = fields.filter(field => field.value.trim() === '')

    fields.map(field => field.classList.remove('error'))
    if(badFields.length > goodFields.length) {
        badFields.map(field => field.classList.add('error'))
        return false
    }

    const form = {}
    fields.map(field =>
        form[field.getAttribute('name')] = field.value)
    return form
}

function encodeData(data) {
    return encodeURI(JSON.stringify(data))
}

function decodedData(data) {
    return JSON.parse(decodeURI(data))
}

function formatFileSize(bytes) {
    if(bytes === 0)
        return '0 Byte';
    const k = 1000,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

class Table {

    constructor(selector) {
        this._rows = document.querySelector(selector).rows
    }

    toJSON() {
        const result = []
        for(let i = 0;i < this._rows.length; i++) {
            if(i === 0) continue
            const row = this._rows[i], line = {}
            for(const cell of row.cells) {
                const input = cell.querySelector('input');

                if(!input) line.name = cell.textContent
                else {
                    if(!line.hasOwnProperty('permissions'))
                        line.permissions = []
                    line.permissions.push(eval(input.getAttribute('flag')))
                }
            }
            result.push(Permission.from(line).exportData())
        }
        return result
    }

    toString() {
        return encodeData(this.toJSON())
    }

}

/* PERMISSIONS */
const PERMISSION = {
    READ: 1<<0,
    LIMITED_WRITING: 1<<1,
    WRITING: 1<<2
}

class Permission {

    constructor(name, permissions = PERMISSION.LIMITED_WRITING) {
        this._name = name
        this._permissions = permissions.reduce((p, c) => p|c)
    }

    static from(data) {
        return new Permission(data.name, data.permissions)
    }

    hasPermission(permission) {
        if(!Object.keys(PERMISSION).includes(permission))
            return console.error('Permission not found.')
        return (this._permissions & permission) === permission
    }

    exportData() {
        return JSON.stringify({
            name: this._name,
            permissions: this._permissions
        })
    }

}

/* customization */
const ICONS = ["folder","user","users","archive","box"],
    COLORS = {
        "var(--text-color)": "var(--filter)",
        "#5D49F5": "invert(41%) sepia(100%) saturate(5154%) hue-rotate(239deg) brightness(95%) contrast(102%)",
        "#c95959": "invert(44%) sepia(14%) saturate(2369%) hue-rotate(312deg) brightness(95%) contrast(81%)",
        "#b754ab": "invert(42%) sepia(23%) saturate(1422%) hue-rotate(256deg) brightness(97%) contrast(88%)",
        "#4268ad": "invert(38%) sepia(13%) saturate(2451%) hue-rotate(180deg) brightness(97%) contrast(88%)"
    }

class FolderCustomization {

    constructor(data = [Object.keys(COLORS)[0], ICONS[0]]) {
        this._data = data
    }

    static from(data) {
        return new FolderCustomization(data.split(';'))
    }

    setColor(color) {
        if(!COLORS.hasOwnProperty(color))
            return console.error('Color not found.')
        this._data[0] = COLORS[color]
    }

    setIcon(icon) {
        if(!ICONS.includes(icon))
            return console.error('Icon not found.')
        this._data[1] = icon
    }

    get getColor() {
        return this._data[0]
    }

    get getIcon() {
        return this._data[1]
    }

    toString() {
        return `${this.getColor};${this.getIcon}`
    }

}

// abstract class used for global modal
class Modal {

    constructor(modalID) {
        this._modalID = modalID

        this._close = this._close.bind(this)
        this.open = this.open.bind(this)
    }

    open() {
        document.querySelector(`${this._modalID} .close`)
            .onclick = () => this._close()
    }

    insert(htmlContent, title) {
        const modalId = this._modalID.replace(/^#/g, '')
        document.body.insertAdjacentHTML('beforeend', `
            <div id="${modalId}" class="window__middle">
                <div class="modal">
                    <span class="close">&times;</span>
                    <h1>${title}</h1>
                    ${htmlContent}
                </div>
            </div>
        `)
    }

    _close() {
        document.querySelector(`${this._modalID}>div`)
            .style.animation = ".5s close-modal alternate"
        setTimeout(() =>
                document.querySelector(this._modalID).remove()
            , 4.5e2)
    }

}

class Alert extends Modal {

    constructor(title, options = null) {
        super('#alert__modal')

        this._title = title
        this._options = options

        this.open()
    }

    _hasDescription() {
        if(this._options.hasOwnProperty('description'))
            return `<h4>${this._options.description}</h4>`
        return ''
    }

    _setActions() {
        if(this._options.actions) {
            const actions = this._options.actions.map(({name,className}) =>
                `<button id="action__${className}" class="action ${className}">${name}</button>`)
            return `<div class="actions">${actions.join('')}</div>`
        }
        return ''
    }

    open() {
        this.insert(`
            ${this._hasDescription()}
            ${this._setActions()}
        `, this._title)

        document.querySelector(`${this._modalID}>.modal`)
            .classList.add('alert__modal')

        if(this._options.actions) {
            this._options.actions.forEach(({className, callback}) => {
                document.getElementById(`action__${className}`)
                    .onclick = () => {
                        if(callback)
                            callback()
                        this._close()
                    }
            })
        }

        super.open()
    }

}