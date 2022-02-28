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