class ChoiceModal extends Modal {

    constructor() {
        super('#choiceModal')

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

        document.getElementById('open__addModal')
            .onclick = () => this.addFileModal.open()

        document.getElementById('open_folderModal')
            .onclick = () => this.addFolderModal.open()

        super.open()
    }

}