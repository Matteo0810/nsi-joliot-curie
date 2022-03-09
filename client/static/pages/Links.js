class Links extends Component {

    constructor() {
        super("/liens", "links", "Liens");
    }

    render() {
        return `
           <section class="links__wrapper">
              <div class="links">
                <h1>Liens</h1>
                
                <div class="links__list">
                    <a href="https://capytale2.ac-paris.fr/web/c-auth/list"
                        target="_blank"
                        class="link capytale">
                         <div class="filter"></div>
                         <h1>Capytale</h1>
                    </a>
                    <a href="http://tkinter.fdex.eu/index.html"
                        target="_blank"
                        class="link tkinter">
                         <div class="filter"></div>
                         <h1>Tkinter</h1>
                    </a>
                </div>
              </div>
           </section>
        `
    }

}