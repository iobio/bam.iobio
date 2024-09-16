import { commonCss } from './lib/iobio-charts/common.js';
import { navigateTo } from './router.js';
import { URLInputModal } from './url_input_modal.js';
import { LocalFileInputModal } from './localFile_input_modal.js'; 
import waygate from 'waygate';


const homePageTemplate = document.createElement('template');
homePageTemplate.innerHTML = `
<style>
${commonCss}
#main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    width: 100%;
    height: 100%;
}

.home-page-title {
    font-size: 28px;
    color: rgb(110,110,110);
    margin-bottom: 30px;
    text-align: center;
}

.file-loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

#local-file-selection {
    display: none;
}

.local-file-input,
.remote-file-input,
.demo-data-input {
    width: 300px;
    height: 60px;
    text-align: center;
    background-color: var(--data-color);
}

.file-selection-button {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    height: 100%;
    font-size: 20px;
    cursor: pointer;
}

#info {
    margin-top: 50px;
}

#info ul {
    list-style-type: none;
    padding: 0;
    text-align: center;
}
    
#info li {
    display: inline;
    margin-right: 50px;
    cursor: pointer;
    color: var(--data-color);
}

.variant-files {
    margin: 50px auto 0px auto;
    font-size: 23px;
    width: 100%;
    text-align: center;
    color: rgb(110,110,110);
}

#marth-lab-footer {
    width: 100%;
    margin-top: 100px;
    padding-bottom: 20px;
}

.logos {
    margin: 0px auto 10px auto;
    width: 1200px;
    text-align: center;
    position: relative;
    height: 60px;
    color: rgb(80,80,80);
}

a {
    color: var(--data-color);
    text-decoration: none; !important;
}

#marthlabtext {
    position: absolute;
    left: 100px;
    top: 4px;
    font-size: 50px;
    font-family:'Overlock SC', cursive;
}
</style>

<div id="main">
    <div class="home-page-title">
        Examine your sequence alignment file in seconds
    </div>

    <div class="file-loading-container">
        <div class="local-file-input">
            <div id="local-file-selection-button" class="file-selection-button">LOCAL BAM/CRAM FILE</div>
        </div>

        <div class="remote-file-input">
            <div id="remote-file-selection-button" class="file-selection-button">REMOTE BAM/CRAM URL</div>
        </div>

        <div class="demo-data-input">
            <div id="demo-data-selection-button" class="file-selection-button">LAUNCH WITH DEMO DATA</div>
        </div>
    </div>
   

    <div id="info">
        <ul>
            <li><a href="http://www.nature.com/nmeth/journal/v11/n12/full/nmeth.3174.html">Publication</a></li>
            <li><span id="file-requirements-button" data-link="/file-requirements">File Requirements</span></li>
            <li><span data-link="/license">License</span></li>
            <li><span data-link="/browser-compatibility">Compatible Browsers</span></li>
        </ul>
    </div>

    <div class="variant-files">
        <div>For variant files check out <a href="http://vcf.iobio.io">vcf.iobio</a></div>
    </div>
</div>

<div id="marth-lab-footer">
    <div class="logos">
        <div id="marthlabtext">Marthlab</div>
        <img src="/images/ustar-ucgd-logo.jpg" style="height:60px;" alt="USTAR UCGD Logo not found"/>
        <a href="http://www.genetics.utah.edu/">
        <img src="/images/genetics_mainlogo3_lrg.png" style="height:50px;position:absolute;right:0px;top:7px" alt="Genetics Logo not found"/>
        </a>
    </div>
</div>
<url-input-modal id="url-input-modal"></url-input-modal>
<local-file-input-modal id="local-file-input-modal"></local-file-input-modal>
`;

class HomePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(homePageTemplate.content.cloneNode(true));
        this.initDOMElements();
    }

    initDOMElements() {
        this.localFileButton = this.shadowRoot.querySelector('#local-file-selection-button');
        this.remoteFileButton = this.shadowRoot.querySelector('#remote-file-selection-button');
        this.demoFileButton = this.shadowRoot.querySelector('#demo-data-selection-button');

        this.localFileInputModal = this.shadowRoot.querySelector('#local-file-input-modal');
        this.urlInputModal = this.shadowRoot.querySelector('#url-input-modal');
    }

    connectedCallback() {
        this.localFileButton.addEventListener('click', () => this.localFileInputModal.showModal());
        // Handle the custom event from the local-file-input-modal
        this.localFileInputModal.addEventListener('local-file-loaded', async (event) => this.handleLocalFileLoaded(event));

        this.remoteFileButton.addEventListener('click', () => this.urlInputModal.showModal());
        // Handle the custom event from the url-input-modal
        this.urlInputModal.addEventListener('remote-file-loaded', (event) => {
            const [url1, url2] = event.detail.urls;
            this.navigateToMainContent(url1, url2);
        });
      
        this.demoFileButton.addEventListener('click', () => this.handleDemoFilePick());

        // Handle navigation clicks for internal links with data-link inside shadow DOM
        this.shadowRoot.querySelectorAll('[data-link]').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const url = event.target.getAttribute('data-link');
                navigateTo(url);
            });
        });
       
    }

    async handleLocalFileLoaded(event) {
        const files = event.detail.files
            const dirTree = waygate.openDirectory();
            dirTree.addFiles(files)

            const listener = await waygate.listen({
                serverDomain: 'waygate.io',
                tunnelType: 'websocket',
              });

            const tunnelDomain = listener.getDomain();
            waygate.serve(listener, waygate.directoryTreeHandler(dirTree));
            const url1 = `https://${tunnelDomain}/${files[0].name}`
            const url2 = `https://${tunnelDomain}/${files[1].name}`
            this.navigateToMainContent(url1, url2);
    }

    handleDemoFilePick() {
        const demoFileUrl = 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam'
        this.navigateToMainContent(demoFileUrl, null);
    }

    // Navigate to the main content page with the URLs
    navigateToMainContent(url1, url2) {
        const queryParams = new URLSearchParams({
            'alignment-url': url1,
        });
        if (url2) {
            queryParams.append('index-url', url2);
        }
        console.log(queryParams.toString())
        const mainContentUrl = `/?${queryParams.toString()}`;
        navigateTo(mainContentUrl);
    }
}

customElements.define('iobio-home-page', HomePage);
export { HomePage }