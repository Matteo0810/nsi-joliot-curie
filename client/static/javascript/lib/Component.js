class Component {

    constructor(url = null, name = null, title = null) {
        this.url = url
        this.name = name
        this.title = title

        this.state = {}
        this.props = {}
    }

    setState(data) {
        this._storeDataIn("state", data)
    }

    setProps(data) {
        this._storeDataIn("props", data)
    }

    get getURL() {
        return this.url
    }

    get getName() {
        return this.name
    }

    get getTitle() {
        return this.title
    }

    render() {}

    componentWillMount() {}

    async loadResources(router) {
        if(this.getName && this.getName !== 'login')
            await this._loadTemplate()
        else document.querySelector('.profile')?.remove()

        document.getElementById('root').innerHTML =
            await router._actualRoute.render()

        this._establishLinks(router)
        await this.componentWillMount()
    }

    async _loadTemplate() {
        if(!document.querySelector('.profile')) {
            const layout = new Layout()

            document.body.insertAdjacentHTML('afterbegin',
                await layout.render())
            await layout.componentWillMount()
        }
    }

    _establishLinks(router) {
        document.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                if(link.hasAttribute('to'))
                    router.switch(link.getAttribute('to'))
                        .catch(console.error)
            }
        })
    }

    _storeDataIn(element, data) {
        if(!data)
            return console.error('Cannot change data')
        Object.entries(data)
            .map(([key, value]) =>
                this[element][key] = value)
    }

}