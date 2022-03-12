class addFolderModal extends Modal {

    constructor() {
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
                </div>
            </div>
        `)

        Object.entries(this.selectors).forEach(([key, value]) => {
            document.querySelector(`.${value.selector}`)
                .onclick = () => this._toggleSelector(key)
            this._initSelector(key, (node) => value.callback(node))
        })

        document.getElementById('createFolder')
            .onclick = this._createFolder()

        this._autoCompleter.init()
        this._reconstructTable()

        super.open()
    }

    _reconstructTable() {
        const tags = ['Utilisateur', 'écriture', 'écriture limitée', 'lecture']
            .map(tag => `<th>${tag}</th>`).join('')
        document.querySelector('.permission__list')
            .innerHTML = `
                <tbody>
                    <tr>${tags}</tr>
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
                </tbody>
            `
    }

    // return table content in array format
    _getTableContent() {
        const { rows } =  document.querySelector('.permission__list'),
            result = []
        console.log(rows)
        for(let i =0;i<rows.length;i++) {
            const line = []
            for(const cell of row.cells)
                line.push(cell.textContent)
            result.push(line)
        }
        console.log(result)
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

    _createFolder() {
        const [color, icon] = this._data,
            name = document.getElementById('name')

        console.log(color, icon)
        this._getTableContent()
        //const result = addFolder({})
    }

    selectors = {
        colors: {
            selector: 'color__chooser',
            callback: (node) => {
                const color = node.getAttribute('color')
                document.querySelector('.color__chooser')
                    .style.background = node.style.background
                document.querySelector('.selected_icon>.icon')
                    .style.filter = color
                this._data[1] = color
            }
        },
        icons: {
            selector: 'selected_icon',
            callback: (node) => {
                const icon = node.querySelector('.icon')
                        .classList.toString().split(' ').pop(),
                    selectedIcon = document.querySelector('.selected_icon>.icon')

                selectedIcon.classList.remove(selectedIcon.classList.toString().split(' ').pop())
                selectedIcon.classList.add(icon)
                this._data[0] = icon
            }
        }
    }

}