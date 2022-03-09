class Settings extends Component {

    constructor() {
        super("/parametres", "settings", "Paramètres");
    }

    async render() {
        const user = await getUser()
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
                            <b>${new Date(user.created_at*1000).toLocaleDateString()}</b>
                        </p>
                    </div>
                </div>
           </section>
        `
    }

}