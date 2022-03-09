class addFolderModal {

    constructor() {
        this._colors = {
            "var(--text-color)": "var(--filter)",
            "#5D49F5": "invert(41%) sepia(100%) saturate(5154%) hue-rotate(239deg) brightness(95%) contrast(102%)",
            "#c95959": "invert(44%) sepia(14%) saturate(2369%) hue-rotate(312deg) brightness(95%) contrast(81%)",
            "#b754ab": "invert(42%) sepia(23%) saturate(1422%) hue-rotate(256deg) brightness(97%) contrast(88%)",
            "#4268ad": "invert(38%) sepia(13%) saturate(2451%) hue-rotate(180deg) brightness(97%) contrast(88%)"
        }
        this._icons = ["folder","user","users", "archive", "tool"]

        this.table = ['everyone']

        this._autoCompleter = new AutoCompleter((node) => {
            const user = node.querySelector('h3').textContent
            if(this.table.includes(user)) return
            this.table.push(user)
            this._reconstructTable()
        })

        this._colorSelectorOpened = false
        this._iconSelectorOpened = false

        this._data = [this._colors[Object.keys(this._colors)[0]], this._icons[0]]
    }

    open() {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="folderModal" class="window__middle">
                <div class="modal">
                    <span class="close">&times;</span>
                    <h1>Ajouter un dossier</h1>
                    
                   <input class="name" id="name" placeholder="Nom du dossier" />
                    <div class="folder_customization">
                        <div class="color_picker">
                            <div class="color__chooser"></div>
                            <div class="selector">
                                ${Object.entries(this._colors)
                                .map(([color, filter]) => {
                                    return `<div color="${filter}" style="background: ${color}" class="color"></div>`
                                }).join('')}
                            </div>
                        </div>
                        <div class="selected_icon">
                            <span class="icon folder"></span>
                        </div>
                        <div class="icon__selector">
                            ${this._icons.map(icon => {
                                return `<div class="item">
                                    <span class="icon ${icon}"></span>
                                </div>`
                            }).join('')}
                        </div>
                    </div>
                    
                    <h4>Ajouter des permissions</h4>
                    
                    <div id="auto__completer"></div>
                    <table class="permission__list"></table>
                </div>
            </div>
        `)

        document.querySelector('#folderModal>.modal>.close')
            .addEventListener('click', this._closeModal)

        document.querySelector('.color__chooser')
            .onclick = () => this.toggleColorSelector()
        this._setColorSelector()

        document.querySelector('.selected_icon')
            .onclick = () => this.toggleIconSelector()
        this._setIconSelector()

        this._autoCompleter.init()
        this._reconstructTable()
    }

    _reconstructTable() {
        document.querySelector('.permission__list')
            .innerHTML = `
                <tr>
                    <th>Utilisateur</th>
                    <th>écriture</th>
                    <th>écriture limitée</th>
                    <th>lecture</th>
                </tr>
                ${this.table.map((user, index) => {
                    return `
                        <tr>
                            <td>${user}</td>
                            <td>
                                <input type="checkbox" id="write_${index}"/>
                                <label for="write_${index}"></label>
                            </td>
                            <td>
                                <input type="checkbox" id="limited_write_${index}" checked/>
                                <label for="limited_write_${index}"></label>
                            </td>
                            <td>
                                <input type="checkbox" id="read_${index}"/>
                                <label for="read_${index}"></label>
                            </td>
                        </tr>
                    `
                }).join('')}
            `
    }

    toggleIconSelector() {
        document.querySelector('.icon__selector')
            .style.display = this._iconSelectorOpened ? "none" : "flex"
        if(this._colorSelectorOpened)
            this.toggleColorSelector()
        this._iconSelectorOpened = !this._iconSelectorOpened
    }

    _setIconSelector() {
        document.querySelectorAll('.icon__selector>.item')
            .forEach(node => {
                node.onclick = () => {
                    const icon = node.querySelector('.icon')
                        .classList.toString().split(' ').pop(),
                        selectedIcon = document.querySelector('.selected_icon>.icon')

                    selectedIcon.classList.remove(selectedIcon.classList.toString().split(' ').pop())
                    selectedIcon.classList.add(icon)
                    this._data[0] = icon
                }
            })
    }

    _setColorSelector() {
        document.querySelectorAll('.selector>.color')
            .forEach(node => {
                node.onclick = () => {
                    const color = node.getAttribute('color')
                    document.querySelector('.color__chooser')
                        .style.background = node.style.background
                    document.querySelector('.selected_icon>.icon')
                        .style.filter = color
                    this._data[1] = color
                }
            })
    }

    toggleColorSelector() {
        document.querySelector('.color_picker>.selector')
            .style.display = this._colorSelectorOpened ? "none" : "flex"
        if(this._iconSelectorOpened)
            this.toggleIconSelector()
        this._colorSelectorOpened = !this._colorSelectorOpened
    }

    _closeModal() {
        document.querySelector('#folderModal>.modal')
            .style.animation = ".5s close-modal alternate"
        setTimeout(() =>
                document.querySelector('#folderModal').remove()
            , 4.5e2)
    }

}