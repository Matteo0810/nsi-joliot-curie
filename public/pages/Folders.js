class Folders extends Component {

    constructor() {
        super("/fichiers", "folders",
            "Fichiers", "files");

        this.fileInteractions = new FileInteractions()
    }

    componentBeforeMount() {
        this.setState({
            id: this.props.params.length > 0 ?
                parseInt(this.props.params[0]) : 1
        })
    }

    async componentWillMount() {
        this.choiceModal = new ChoiceModal(this.state.id)

        document.getElementById('open__choiceModal')
            .onclick = () => this.choiceModal.open()

        await this._loadFiles()
    }

    async _loadFiles() {
        const {name,files,folders} = await getFolder(this.state.id)
        document.querySelector('.loading__content').remove()
        document.querySelector('.list')
            .insertAdjacentHTML('beforeend',
                [...files, ...folders]
                  .filter(({name}) => name !== 'root')
                  .map(data => new RepositoryElement(data).get()).join(''))
        this._loadPath(name)
        this.fileInteractions.reload()
    }

    async render() {
        return `
            <section class="files__section">
                <div class="files__list">
                    <h1>Mes fichiers</h1>
                    <div class="path">
                        <div class="text__loading"></div>
                    </div>
                    
                    <div class="list">
                        <div id="open__choiceModal">
                             <span>Ajouter un élément</span>
                        </div>
                        <div class="loading__content"></div>
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

    _loadPath(name) {
        const pathNode = document.querySelector('.path')
        pathNode.innerHTML = `<a to="/fichiers"><span class="root">Dossier racine</span></a>`
        if(name === 'root') return
        pathNode.insertAdjacentHTML('beforeend', `
                <span>&gt;</span>
                <a><span>${name}</span></a>
            `)
    }

}