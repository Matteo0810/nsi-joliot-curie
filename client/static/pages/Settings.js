class Settings extends Component {

    constructor() {
        super("/parametres", "settings",
            "Paramètres", "settings");
    }

    async render() {
        const user = await userData
        return `
           <section class="settings__wrapper">
                <div class="middle">
                     <h1>Paramètres</h1>
                     
                     <div class="fields">
                        <div class="flex">
                            <div>
                                <h3>Prénom</h3>
                                <input value="${user.surname}" disabled />
                             </div>
                             <div>
                                <h3>Nom</h3>
                                <input value="${user.name}" disabled />
                             </div>
                        </div>
                        <p>
                            Compte créé le 
                            <b>${parseDate(user.created_at)}</b>
                        </p>
                    </div>
                </div>
           </section>
        `
    }

}