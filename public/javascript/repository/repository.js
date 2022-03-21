class FileInteractions {

    constructor() {
        this.reload()
    }

    _handle(node) {
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
            case 'info':
                const data = decodedData(node.getAttribute('file_data'))
                new FileInfo(data).open()
                break;
        }
    }

    reload() {
        document.querySelectorAll('.more__button')
            .forEach(node => {
                node.onclick = () => {
                    const selector = node.querySelector('.selector');

                    selector.querySelectorAll('li')
                        .forEach(li => {
                            li.onclick = () => {
                                this._handle(li)
                            }
                        })
                    selector.style.display = selector.style.display==="block"?"none":"block"
                }
            })
    }

}

class FileInfo extends Modal {

    constructor(data) {
        super('#fileInfo')

        this._data = data
    }

    open() {
        const { name, file_size, created_at } = this._data,
            infos = [
                { name: "Nom du fichier", data: name },
                { name: "Taille du fichier", data:formatFileSize(file_size)},
                { name: "Créé le", data: parseDate(created_at) },
                { name: "Votre permission", data: "Lecture, Écriture" }
            ]

        this.insert(infos.map(({name, data}) => `
            <h3 class="info">
                <span>${name}</span>
                ${data}
            </h3>
        `).join(''), 'Informations')

        super.open()
    }
}

class RepositoryElement {

    constructor(data) {
        this._data = data
        this._file = this._data.name.split('.')
    }

    _toFolder() {
        const custom = FolderCustomization.from(this._data.icon)
        return `
            <a to="/fichiers/${this._data.folder_id}" class="folder">
                <span style="filter: ${custom.getColor}" 
                    class="icon ${custom.getIcon}"></span>
                <h1>${this._data.name}</h1>
            </a>
        `
    }

    _toFile() {
        const extension = this._file.pop().toLowerCase();
        return `
            <div class="file" id="file__${this._data.file_id}">
                <div class="more__button"> 
                    <span class="icon more"></span>
                    
                    <ul file="${this._data.file_id}" class="selector">
                        <li id="select"><span class="icon check"></span>Séléctionner</li>
                        <li id="modify"><span class="icon pencil"></span>Modifier</li>
                        <a href="${this._data.path}"  download="${this._data.name}" target="_blank" id="download"><span class="icon download"></span>Télécharger</a>
                        <li id="delete"><span class="icon cross"></span> Supprimer</li>
                        <li file_data="${encodeData(this._data)}" id="info"><span class="icon info"></span>Infos</li>
                    </ul>
                </div>
                <span class="icon ${this._getFileIcon(extension)}"></span>
                <div class="details">
                    <h1>${this._formatToFileName(name, extension)}</h1>
                </div>
            </div>
        `
    }

    _getFileIcon(extension) {
        const imageExtensions = ["png", "jpg"],
            extensions = ["pdf"]

        let icon = "document"
        if(extensions.includes(extension))
            icon = extension
        else if(imageExtensions.includes(extension))
            icon = "image"
        return icon
    }

    _formatToFileName(name, extension) {
        const MAX_LENGTH = 17
        return this._data.name.length > MAX_LENGTH ?
                        this._data.name.slice(0, MAX_LENGTH-8).concat(`.${extension}`) : this._data.name
    }

    get() {
        return this._file.length < 2 ?
            this._toFolder() : this._toFile()
    }

}