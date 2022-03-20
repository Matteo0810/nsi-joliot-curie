class Login extends Component {

    constructor() {
        super("/connexion", "login", "Connexion");
    }

    async componentWillMount() {
        document.getElementById('submit')
            .addEventListener('click', this._submit)
    }

    async _submit() {
        const form = validateForm('.form>input')
        if(!form)
            return
        const response = await loginUser(form)

        if(response.status >= 400)
            return sendNotification(response.message)

        localStorage.setItem('token', response.token)
        clearInputs(document.querySelectorAll('.form>input'))

        await router.switch('/')
    }

    render() {
        return `
           <section class="login__wrapper">
                <div class="left"></div>
                <div class="right">
                    <div class="login__form">
                        <h1>Connexion</h1>
                        
                        <div class="form">
                            <input name="username" type="text" placeholder="Votre nom" />
                            <input name="password" type="password" placeholder="Votre mot de passe" />

                            <button id="submit">Connexion</button>
                        </div>
                    </div>
                </div>
           </section>
        `
    }

}