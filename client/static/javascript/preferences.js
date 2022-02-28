const themes = {
    DARK: 'dark',
    LIGHT: 'light'
}

function getTheme() {
    return localStorage.getItem('theme')
}

if(!getTheme()) { // has preference
    localStorage.setItem('theme', themes.LIGHT)
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