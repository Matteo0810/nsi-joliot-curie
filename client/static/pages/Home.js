class Home extends Component {

    constructor() {
        super("/", "home",
            "Accueil", "home");
    }

    componentWillMount() {
        document.querySelectorAll('.unvalaible')
            .forEach(node => {
                node.onclick = () => {
                    new Alert('Indisponible', {
                        description: "Je suis désolé, cette fonction est indisponible pour le moment.",
                        actions: [{ name: "Je comprends", className:"action__yes" }]
                    })
                }
            })
    }

    async render() {
        const user = await userData
        return `
            <section class="home">
                 <section>
                    <div class="right__top">
                        <div class="top__left">
                            <h1>Bonjour ${user.surname},</h1>
                            <h4>Bienvenue à nouveau</h4>
                        </div>
                        <div class="top__picture"></div>
                    </div>
                    <div class="right__bottom">
                        <div class="tools__wrapper">
                            <a to="/" class="tool unvalaible">
                                <h1>Consultez votre agenda</h1>
                                <div class="picture agenda"></div>
                            </a>
                            <a to="/coder" class="tool">
                                <h1>Entraînez-vous à coder</h1>
                                <div class="picture code"></div>
                            </a>
                            <a to="/" class="tool unvalaible">
                                <h1>Consultez vos tableaux</h1>
                                <div class="picture todolist"></div>
                            </a>
                        </div>
                    </div>
                </section>
                <section class="last__files">
                    <h1>Derniers ajouts</h1>
                    
                    <div class="files">
                        <a class="file">
                            <span class="icon folder"></span>
                            <p>test</p>
                        </a>
                    </div>
                </section>
            </section>
        `
    }

}