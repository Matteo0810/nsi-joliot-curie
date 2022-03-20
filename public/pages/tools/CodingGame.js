class CodingGame extends Component {

    constructor() {
        super("/coder", "coding", "entrainez-vous à coder");

        this._input = this._input.bind(this);
    }

    componentWillMount() {
        document.getElementById('code')
            .addEventListener('input', this._input)
    }

    _input({ target }) {
        //target.innerHTML = (new HighLight(target.innerHTML)).toHTML()
    }


    render() {
        return `
           <section class="code__wrapper">
              <div class="top">
                    <div class="statement">
                    
                </div>
                <div spellcheck="false" contenteditable="true" id="code">
<span class="color_2"># pour tester sans avoir d'erreur :</span> <br>
<span class="color_2">#  print("Message...", file=sys.stderr, flush=True)</span> <br>
<br>
<span class="color_3">print</span><span class="color_1">(</span><span class="color_4">"Réponse..."</span><span class="color_1">)</span> <br>
</div>
              </div>
              <div class="output">
                
              </div>
           </section>
        `
    }

}

class HighLight {

    constructor(content) {
        this._content = content.split('<br>')
    }

    _convert(line) {
        const isFunction = this._isFunction(line)
        if(isFunction)
            return isFunction
        return line
    }

    _removeHTML(line) {
        return line.replace( /(<([^>]+)>)/ig, '').trim()
    }

    _isFunction(line) {
        const groups = /[a-z|A-Z|0-9|_]*(\(.*?\))/g.exec(this._removeHTML(line));
        if(!groups || groups.length < 2)
            return null
        let functionName = groups[0].replace(groups[1], ''),
            content = groups[1].replace(/^\(|\)$/g, '')

        functionName = `<span class="color_3">${functionName}</span>`
        content = `<span class="color_4">${content}</span>`

        return `${functionName}<span class="color_1">(</span>${content}<span class="color_1">)</span>`
    }

    toHTML() {
        return this._content.map(line => this._convert(line))
            .join('<br>')
    }

}