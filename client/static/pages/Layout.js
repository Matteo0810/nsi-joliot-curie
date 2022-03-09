class Layout extends Component {

    componentWillMount() {
        document.querySelectorAll('.themes>div')
            .forEach(node => node
                .addEventListener('click', this._changeTheme))

        document.getElementById('disconnect')
            .addEventListener('click', this._disconnect)
    }

    _changeTheme({ target }) {
        target = target.parentNode.getAttribute('theme') ?
            target.parentNode : target
        changePreference(target.getAttribute('theme'))
    }

    async _disconnect() {
        delete localStorage['token']
        await router.switch("/")
    }

    async render() {
        const user = await getUser()
        return `
            <section class="profile">
                <div class="top">
                    <button id="disconnect">
                        <span class="icon sign-out"></span></button>
            
                    <img src="/static/images/profile.jpg" alt="profile" />
                </div>
            
                <h3>${user.surname} ${user.name}</h3>
            
                <nav>
                    <ul>
                        <li class="active">
                            <a to="/"><span class="icon news"></span> Actualités</a>
                        </li>
                        <li>
                            <a to="/fichiers"><span class="icon multiple-folders"></span> Dossiers</a>
                        </li>
                        <li>
                            <a to="/liens"><span class="icon links"></span> Liens</a>
                        </li>
                        <li>
                            <a to="/parametres"><span class="icon settings"></span> Paramètres</a>
                        </li>
                    </ul>
                </nav>
            
                <div class="bottom">
                    <div class="themes">
                        <div theme="light" class="light">
                            <span class="icon sun"></span>
                            <span class="text">Jour</span>
                        </div>

                        <div class="fill"></div>
            
                        <div theme="dark" class="dark">
                            <span class="icon moon"></span>
                            <span class="text">Nuit</span>
                        </div>
                    </div>
                </div>
            </section>
        `
    }

}