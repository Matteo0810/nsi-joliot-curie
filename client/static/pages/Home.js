class Home extends Component {

    constructor() {
        super("/", "home", "Accueil");
    }

    async render() {
        const user = await getUser()
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
                        
                    </div>
                </section>
                <section>
                    
                </section>
            </section>
        `
    }

}