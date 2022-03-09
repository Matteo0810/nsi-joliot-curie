class ChoiceModal {

    constructor() {
        this.addFileModal = new AddFileModal()
        this.addFolderModal = new addFolderModal()
    }

    open() {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="choiceModal" class="window__middle">
                <div class="modal">
                    <span class="close">&times;</span>
                    <h1>Ajouter un élément</h1>
                    
                    <div class="choice">
                         <div id="open_folderModal" class="item">
                            <div class="folder">
                                <span class="icon image"></span>
                                <span class="icon document"></span>
                                <span class="icon pdf"></span>
                                <span class="icon folder-open"></span>
                            </div>
                            <h4>Dossier</h4>
                        </div>
                        <div id="open__addModal" class="item">
                            <span class="icon document"></span>
                            <h4>Fichier</h4>
                        </div>
                    </div>
                </div>
            </div>
        `)

        document.querySelector('.close')
            .addEventListener('click', this._closeModal)

        document.getElementById('open__addModal')
            .onclick = () => this.addFileModal.open()

        document.getElementById('open_folderModal')
            .onclick = () => this.addFolderModal.open()
    }

    _closeModal() {
        document.querySelector('#choiceModal>.modal')
            .style.animation = ".5s close-modal alternate"
        setTimeout(() =>
                document.querySelector('#choiceModal').remove()
            , 4.5e2)
    }

}