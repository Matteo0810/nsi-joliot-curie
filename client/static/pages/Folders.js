class Folders extends Component {

    constructor() {
        super("/fichiers", "folders",
            "Fichiers", "files");
    }

    componentBeforeMount() {
        this.setState({
            id: this.props.params.length > 0 ? parseInt(this.props.params[0]) : 1
        })
    }

    componentWillMount() {
        this.choiceModal = new ChoiceModal(this.state.id)

        document.getElementById('open__choiceModal')
            .addEventListener('click', () => this.choiceModal.open())
        new FileActions()
    }

    async render() {
        const FILE_ID = this.state.id,
            { folders, folder_data } = await getFolder(FILE_ID);
        let files = [];

        if(folders.length > 1) {
            const currentFolder = folders.filter(({id}) => id === FILE_ID).pop()
            if(currentFolder)
                files = files.files
        }

        return `
            <section class="files__section">
                <div class="files__list">
                    <h1>Mes fichiers</h1>
                    <div class="path">
                        ${this._reconstructFilePath(folder_data)}
                    </div>
                    
                    <div class="list">
                        <div id="open__choiceModal">
                             <span>Ajouter un élément</span>
                        </div>
                        ${[...folders, ...files]
                            .filter(({name}) => name !== 'root')
                            .map(data => new FileData(data).toFile())
                            .join('')}
                    </div>
                </div>
                <!--<div class="files__tree">
                    <div class="folder root">
                        <span>Dossier racine</span>
                    </div>
                    <div class="folder actual">
                        <span>test</span>
                    </div>
                </div>-->
            </section>
        `
    }

    _reconstructFilePath(folder_data) {
        return `
            <a to="/fichiers"><span class="root">Dossier racine</span></a>
            ${folder_data ? `
                <span>&gt;</span>
                <a><span>${folder_data?.name}</span></a>
            ` : ''}
        `
    }

}