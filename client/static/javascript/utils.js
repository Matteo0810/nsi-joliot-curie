const DEBUG = true

async function read(path, isJson = false) {
    try {
        const response = await fetch(`./static/${path}`, { method: 'GET' })
        return isJson ? response.json() : response.text()
    } catch {
        console.error('File not found.')
    }
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

class Alert {

    constructor(title, options = null) {
        this._title = title
        this._options = options

        this._show()
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

    _close() {
        document.querySelector('.alert__modal')
            .style.animation = ".5s close-modal alternate"
        setTimeout(() =>
                document.querySelector('.window__middle').remove()
            , 4.5e2)
    }

    _show() {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="window__middle">
                <div class="alert__modal">
                    <span class="close">&times;</span>
                    <h1>${this._title}</h1>
                    ${this._hasDescription()}
                    ${this._setActions()}
                </div>
            </div>
        `)

        document.querySelector('.close')
            .addEventListener('click', () =>
                this._close())

        if(this._options.actions) {
            this._options.actions.forEach(({className, callback}) => {
                document.getElementById(`action__${className}`)
                    .onclick = () => {
                        callback()
                        this._close()
                    }
            })
        }
    }

}