class addFolderModal extends Modal {

    constructor(folderId) {
        super('#folderModal')

        this._colors = {
            "var(--text-color)": "var(--filter)",
            "#5D49F5": "invert(41%) sepia(100%) saturate(5154%) hue-rotate(239deg) brightness(95%) contrast(102%)",
            "#c95959": "invert(44%) sepia(14%) saturate(2369%) hue-rotate(312deg) brightness(95%) contrast(81%)",
            "#b754ab": "invert(42%) sepia(23%) saturate(1422%) hue-rotate(256deg) brightness(97%) contrast(88%)",
            "#4268ad": "invert(38%) sepia(13%) saturate(2451%) hue-rotate(180deg) brightness(97%) contrast(88%)"
        }
        this._icons = ["folder","user","users", "archive", "box"]

        this.table = ['everyone']

        this._autoCompleter = new AutoCompleter((node) => {
            const user = node.querySelector('h3').textContent
            if(this.table.includes(user)) return
            this.table.push(user)
            this._reconstructTable()
        })

        this._selectors = { colors: false, icons: false }
        this._customization = new FolderCustomization()

        this._folderId = folderId
        this._createFolder = this._createFolder.bind(this)
    }

    open() {
        this.insert(`

           <input class="name" id="name" placeholder="Nom du dossier" />
            <div class="folder_customization">
                <div class="color_picker">
                    <div class="color__chooser"></div>
                    <div class="colors__selector">
                        ${Object.entries(this._colors)
                            .map(([color, filter]) => {
                                return `<div color="${filter}" style="background: ${color}" class="color item"></div>`
                            }).join('')}
                    </div>
                </div>
                <div class="selected_icon">
                    <span class="icon folder"></span>
                </div>
                <div class="icons__selector">
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
            
            <button id="createFolder">Créer</button>
        `, 'Ajouter un dossier')

        Object.entries(this.selectors).forEach(([key, value]) => {
            document.querySelector(`.${value.selector}`)
                .onclick = () => this._toggleSelector(key)
            this._initSelector(key, (node) => value.callback(node))
        })

        document.getElementById('createFolder')
            .onclick = this._createFolder

        this._autoCompleter.init()
        this._reconstructTable()

        super.open()
    }

    _reconstructTable() {
        const tags = ['Utilisateur', 'écriture', 'écriture limitée', 'lecture']
            .map(tag => `<th>${tag}</th>`).join(''),
        permissionsModels = [
            { name: "writting", bitFlag: PERMISSION.WRITING },
            { name: "limited_writting", bitFlag: PERMISSION.LIMITED_WRITING, checked: true },
            { name: "read", bitFlag: PERMISSION.READ }]

        document.querySelector('.permission__list')
            .innerHTML = `
                <tbody>
                    <tr>${tags}</tr>
                    ${this.table.map((user, index) => {
                        return `
                            <tr>
                                <td>${user}</td>
                                ${permissionsModels.map(({name, bitFlag, checked=false}) => {
                                    return `
                                       <td>
                                           <input flag="${bitFlag}" type="checkbox" id="${name}_${index}" ${checked ? "checked":""} />
                                           <label for="${name}_${index}"></label>
                                       </td>
                                    `
                                }).join('')}

                            </tr>
                        `
                    }).join('')}
                </tbody>
            `
    }

    _toggleSelector(selector, reset=false) {
        if(!this._selectors.hasOwnProperty(selector))
            return console.error('selector not found.')
        const node = document.querySelector(`.${selector}__selector`)
        if(reset) {
            node.style.display = "none"
            this._selectors[selector] = false
            return
        }
        let isOpened = this._selectors[selector]
        node.style.display = isOpened ? "none" : "flex"
        isOpened = !isOpened
        Object.keys(this._selectors).forEach(key => {
            if(key !== selector)
                this._toggleSelector(key, true)
        })
        this._selectors[selector] = isOpened
    }

    _initSelector(name, callback) {
        if(!name || !callback)
            return console.error('Name or callback was not found.')
        document.querySelectorAll(`.${name}__selector>.item`)
            .forEach(node => node.onclick = () => callback(node))
    }

    async _createFolder() {
        const table = new Table('.permission__list'),
            name = document.getElementById('name').value.trim()

        if(!name)
            return console.error('\'Name\' field is empty.')

        const { user_id } = await userData,
        result = await addFolder({
            name: name,
            owner_id: user_id,
            permission: table.toString(),
            from_folder: this._folderId,
            icon: this._customization.toString()
        })

        if(result.code>=400)
            return sendNotification(result.message)

        // TODO FIX FOLDER ADDITION
        document.querySelector('.list')
            .insertAdjacentHTML('beforeend',
                new FileData(result.folder).toFile())

        this._close()
        sendNotification('Dossier ajouté !')
    }

    selectors = {
        colors: {
            selector: 'color__chooser',
            callback: (node) => {
                const attrColor = node.getAttribute('color')
                this._customization.setColor(attrColor)
                const color = this._customization.getColor

                document.querySelector('.color__chooser').style.background = attrColor
                document.querySelector('.selected_icon>.icon').style.filter = color
            }
        },
        icons: {
            selector: 'selected_icon',
            callback: (node) => {
                const iconFrom = (selector) => selector.classList.toString().split(' ').pop(),
                    selectedIcon = document.querySelector('.selected_icon>.icon')

                selectedIcon.classList.remove(iconFrom(selectedIcon))

                this._customization.setIcon(iconFrom(node.querySelector('.icon')))
                selectedIcon.classList.add(this._customization.getIcon)
            }
        }
    }

}