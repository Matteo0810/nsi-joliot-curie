class AutoCompleter {

    constructor(handler) {
        this._handler = handler
    }

    async getResult(query) {
       return await searchUsers(query)
    }

    init() {
        document.getElementById('auto__completer')
            .insertAdjacentHTML('beforeend', `
            <div class="auto__completer">
                <input id="autocomplete__input" type="text" placeholder="Rechercher un utilisateur" />
                <ul class="suggestion"></ul>
            </div>
        `)

        document.getElementById('autocomplete__input')
            .oninput = async ({ target }) => {
                const { value } = target,
                    val = value.trim(),
                    size = val.trim().length
                document.querySelector('.suggestion').innerHTML = ""
                if(size >= 1) {
                    const { results } = await this.getResult(val)
                    if(results.length < 1)
                        this._notResult()
                    for(const result of results)
                        this._addSuggestion(result)
                }
                document.querySelector('.suggestion')
                    .style.display = size < 1 ? "none" : "block"
            }
    }

    _notResult() {
        document.querySelector('.suggestion')
            .innerHTML = "<h3>Aucun resultat trouvé</h3>"
    }

    _addSuggestion({ surname, name }) {
        document.querySelector('.suggestion')
            .insertAdjacentHTML('beforeend', `
                <li class="suggestion__item">
                    <img src="/static/images/profile.jpg" alt="user logo" />
                    <h3>${surname} ${name}</h3>
                </li>
            `)

        const node = document.querySelector('.suggestion__item')
        node.onclick = () => {
                this._handler(node)
                document.querySelector('.suggestion')
                    .style.display = "none"
                document.getElementById('autocomplete__input')
                    .value = ""
            }
    }

}