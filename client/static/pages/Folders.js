class Folders extends Component {

    constructor() {
        super("/fichiers", "folders",
            "Fichiers", "files");

        this.choiceModal = new ChoiceModal()
    }

    componentBeforeMount() {
        this.setState({
            id: this.props.params.length > 0 ? parseInt(this.props.params[0]) : 1
        })
    }

    componentWillMount() {
        document.getElementById('open__choiceModal')
            .addEventListener('click', () => this.choiceModal.open())
        new FileActions()
    }

    async render() {
        const FILE_ID = this.state.id,
            { folders } = await getFolder(FILE_ID),
            files = folders.length > 0 ?
                folders.filter(({id}) => id === FILE_ID).pop().files : folders

        return `
            <section class="files__section">
                <div class="files__list">
                    <h1>Mes fichiers</h1>
                    <div class="path">
                        <a to="/fichiers"><span class="root">Dossier racine</span></a>
                        <span>&gt;</span>
                        <a to="/fichiers"><span>test</span></a>
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

}