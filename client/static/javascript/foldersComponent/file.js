class FileActions {

    constructor() {
        this.setActions()
    }

    _handleAction(node) {
        const { id } = node,
            fileId = parseInt(node.parentNode.getAttribute('file'))
        switch(id) {
            case 'select':

                break;
            case 'delete':
                new Alert('Êtes-vous sûr sur vouloir supprimer ?', {
                    description: 'Cette action est irréversible...',
                    actions: [{ name: 'Je veux supprimer',
                        className: "action__yes",
                        callback: async () => {
                            const result = await deleteFile(fileId)
                            if(result.code > 400)
                                return sendNotification(result.message)
                            document.getElementById(`file__${fileId}`)
                                .remove()
                            return sendNotification(result.message)
                        }
                    }]
                })
                break;
        }
    }

    setActions() {
        document.querySelectorAll('.more__button')
            .forEach(node => {
                node.onclick = () => {
                    const selector = node.querySelector('.selector');

                    selector.querySelectorAll('li')
                        .forEach(li => {
                            li.onclick = () => {
                                this._handleAction(li)
                            }
                        })
                    selector.style.display = selector.style.display==="block"?"none":"block"
                }
            })
    }

}

class FileData {

    constructor(data) {
        this._data = data
        this._file = this._data.name.split('.')
    }

    _toFolder() {
        return `
            <a to="/fichiers/${this._data.id}" class="folder">
                <span class="icon folder"></span>
                <h1>${this._data.name}</h1>
            </a>
        `
    }

    _toFile() {
        const extension = this._file.pop().toLowerCase(),
            imageExtensions = ["png", "jpg"],
            extensions = ["pdf"],
            MAX_LENGTH = 17
        let icon = "document"
        if(extensions.includes(extension))
            icon = extension

        return `
            <div class="file" id="file__${this._data.id}">
                <div class="more__button"> 
                    <span class="icon more"></span>
                    
                    <ul file="${this._data.id}" class="selector">
                        <li id="select"><span class="icon check"></span>Séléctionner</li>
                        <li id="modify"><span class="icon pencil"></span>Modifier</li>
                        <a href="${this._data.path}"  download="${this._data.name}" target="_blank" id="download"><span class="icon download"></span>Télécharger</a>
                        <li id="delete"><span class="icon cross"></span> Supprimer</li>
                        <li id="info"><span class="icon info"></span>Infos</li>
                    </ul>
                </div>
                <span class="icon ${icon}"></span>
                <div class="details">
                    <h1>${this._data.name.length > MAX_LENGTH ?
            this._data.name.slice(0, MAX_LENGTH-7).concat(extension) : this._data.name}</h1>
                </div>
            </div>
        `
    }

    toFile() {
        return this._file.length < 2 ?
            this._toFolder() : this._toFile()
    }

}