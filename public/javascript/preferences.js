const themes = {
    DARK: 'dark',
    LIGHT: 'light'
}

function getTheme() {
    return localStorage.getItem('theme')
}

if(!getTheme()) {
    localStorage.setItem('theme', themes.DARK)
}

function changePreference(theme) {
    if(!Object.values(themes).includes(theme))
        return console.error('Theme not found.')
    localStorage.setItem('theme', theme)
    updatePreference()
}

function updatePreference() {
    document.querySelector('html')
        .setAttribute('data-theme', getTheme())
}

document.addEventListener('DOMContentLoaded', updatePreference)