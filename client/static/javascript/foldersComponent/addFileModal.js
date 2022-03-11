class AddFileModal extends Modal {

    constructor() {
        super('#modal_add')

        this.files = []

        this._initInput = this._initInput.bind(this)
        this._initDrag = this._initDrag.bind(this)
        this._send = this._send.bind(this)
    }

    open() {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="modal_add" class="window__middle">
                <div class="modal">
                    <span class="close">&times;</span>
                    <h1>Ajouter des fichiers</h1>
                    
                    <input type="file" multiple="multiple" id="drag" />
                    <label for="drag" class="drag__area" draggable="true">
                        <p>Glissez-déposez ou cliquez ici</p>
                    </label>
                    
                    <button id="add">Ajouter</button>
                </div>
            </div>
        `)

        this._initInput()
        this._initDrag()

        document.getElementById('add')
            .addEventListener('click', this._send)

        super.open()
    }

    _close() {
        super._close()
        this.files = []
    }

    _initInput() {
        document.getElementById('drag')
            .addEventListener('change', () => {
                for(const file of document.getElementById('drag').files)
                    this._addFile(file)
            })
    }

    _initDrag() {
        const dragArea = document.querySelector('.drag__area'),
            REMOVE_COLOR = "#5D49F5", ADD_COLOR = "#8c7efa"

        dragArea.addEventListener('dragenter', (e) => {
            e.preventDefault()
            dragArea.style.borderColor = ADD_COLOR
        })
        dragArea.addEventListener('dragover', (e) => {
            e.preventDefault()
            dragArea.style.borderColor = ADD_COLOR
        })
        dragArea.addEventListener('dragleave', () =>
            dragArea.style.borderColor = REMOVE_COLOR)
        dragArea.addEventListener('drop', (e) => {
            e.preventDefault()
            dragArea.style.borderColor = REMOVE_COLOR
            const items = e.dataTransfer.items;
            if(!items) return
            for(const item of items) {
                if(item.kind === "file")
                    this._addFile(item.getAsFile())
            }
        })
    }

    _addFile(file) {
        const files = this.files,
            dragArea = document.querySelector('.drag__area'),
            MAX_LENGTH = 36

        if((file.size >>> 20) > 128) { // max 128 MB
            this._dragAreaError()
            return
        }

        if(files.length < 1)
            dragArea.innerHTML = `<p class="files">Fichiers 
                <span id="files_length">${files.length}</span></p>`
        this.files.push(file)

        if(files.length < 7)
            dragArea.insertAdjacentHTML('beforeend',
                files.length < 6 ?
                    `<p class="file">${file.name.length <= MAX_LENGTH ?
                        file.name :
                        file.name.slice(0, MAX_LENGTH-3).concat('...')}</p>`
                    : '...')
        document.getElementById('files_length')
            .textContent = files.length.toString()
    }

    _dragAreaError() {
        const dragArea = document.querySelector('.drag__area');
        dragArea.classList.add('error')
        setTimeout(() => dragArea.classList.remove('error'), 1e3)
    }

    async _send() {
        const files = this.files
        if(files.length < 1) {
            this._dragAreaError()
            return
        }
        const formData = new FormData()
        for(const file of files)
            formData.append(file.name, file)
        const result = await addFiles(formData)
        if(result.code > 400)
            return sendNotification(result.message)
        this._close()
        result.files.map(file => {
            document.querySelector('.list')
                .insertAdjacentHTML('beforeend',
                    new FileData(file).toFile())
        })
        new FileActions()
        return sendNotification(`${result.files.length} fichier(s) ajouté(s).`)
    }

}