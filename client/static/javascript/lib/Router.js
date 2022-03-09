class Router {

    constructor() {
        this._routes = {}
        this._actualRoute = null
        this._defaultTitle = document.title
    }

    async init() {
        const routes = [Login, Home, Folders, Links, Settings, CodingGame]
        for(let route of routes) {
            route = new route
            debug(`${route.getName} route with path "${route.getURL}" added`)
            this._routes[route.getURL] = route
        }

        const path = window.location.href.includes('?page=') ?
            `${window.location.href
                .replace(/(.*)\?page=/g, '')}` : "/"
        await this.switch(path)
    }

    async switch(path) {
        path = new _Path(path)

        if(!this._routes.hasOwnProperty(path))
            return console.warn(`"${path}" was not found`)

        if(path.withoutURL === '/')
            this._actualRoute = localStorage.getItem('token') ?
                new Home : new Login
        else
            this._actualRoute = this._routes[path]

        this._actualRoute.setProps({
            params: path.getParams()
                ? path.getParams() : {}
        })

        const start = Date.now();

        this._actualRoute.loadResources(this)
            .catch(console.error)

        window.history.pushState(null, null, path.getURL())
        document.title = `${this._defaultTitle} | 
            ${this._actualRoute.getTitle}`

        const time = Math.round(Date.now() - start)
        debug(`Page rendered in ${time} ms`)
        if(time >= 40)
            console.warn('You currently have more than 40 ms of render time.')

        debug(`"${this._actualRoute?.getURL}" switched to "${path}"`)
    }

}

class _Path {

    constructor(defaultPath) {
        this._defaultPath = defaultPath
        this._splittedPath = defaultPath.split('/')

        this._params = this._splittedPath.slice(2)
        this._formattedPath = `/${this._splittedPath[1]}`
    }

    getURL() {
        const url = window.location.href.replace(/\/$/g, '')
            .replace(/\?page=(.*)/g, '')
        return `${url}?page=${this._defaultPath}`
    }

    getParams() {
        return this._params
    }

    get withoutURL() {
        return this._formattedPath
    }

    toString() {
        return this.withoutURL
    }

}