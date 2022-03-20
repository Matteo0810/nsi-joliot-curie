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
        const {name,files,folders} = await getFolder(this.state.id);
        console.log(name)

        return `
            <section class="files__section">
                <div class="files__list">
                    <h1>Mes fichiers</h1>
                    <div class="path">
                        <a to="/fichiers"><span class="root">Dossier racine</span></a>
                        ${name !== 'root' ? `
                            <span>&gt;</span>
                            <a><span>${name}</span></a>
                        ` : ''}
                    </div>
                    
                    <div class="list">
                        <div id="open__choiceModal">
                             <span>Ajouter un élément</span>
                        </div>
                        ${[...files, ...folders]
                            .filter(({name}) => name !== 'root')
                            .map(data => new FileData(data).get()).join('')}
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