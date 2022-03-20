class Layout extends Component {

    componentWillMount() {
        document.querySelectorAll('.themes>div')
            .forEach(node => node
                .addEventListener('click', this._changeTheme))

        document.getElementById('disconnect')
            .addEventListener('click', this._disconnect)
        document.getElementById('root').classList.add('extended')
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
        const user = await userData
        return `
            <section class="profile">
                <div class="top">
                    <div class="right">
                        <img src="/public/assets/images/profile.jpg" alt="profile" />
                    </div>
                    <div class="left">
                        <h3>${user.name}</h3>
                        <h3>${user.surname}</h3>
                    </div>
                </div>
            
                <nav>
                    <ul>
                        <a to="/">
                            <li class="link__home active">
                                <span class="icon news"></span> 
                                <span>Actualités</span>
                            </li>
                        </a>
                        <a to="/fichiers">
                            <li class="link__files">
                                <span class="icon multiple-folders"></span> 
                                <span>Dossiers</span>
                            </li>
                        </a>
                        <a to="/liens">
                            <li class="link__links">
                                <span class="icon links"></span> 
                                <span>Liens</span>
                            </li>
                        </a>
                        <a to="/parametres">
                            <li class="link__settings">
                                <span class="icon settings"></span> 
                                <span>Paramètres</span>
                            </li>
                        </a>
                    </ul>
                </nav>
            
                <div class="bottom">
                    <div id="disconnect" class="disconnect">
                        <span class="icon sign-out"></span>
                        <span>Déconnexion</span>
                    </div>
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