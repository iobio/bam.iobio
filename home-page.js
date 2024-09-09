import { commonCss } from '../../common.js';
import { navigateTo } from './router.js';
import { URLInputModal } from './url_input_modal.js';
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
            <input type="file" id="local-file-selection" multiple>
            <label for="local-file-selection" class="file-selection-button">LOCAL BAM/CRAM FILE</label>
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
        <img src="/images/ustar-ucgd-logo.jpg" style="height:60px;"/>
        <a href="http://www.genetics.utah.edu/">
        <img src="/images/genetics_mainlogo3_lrg.png" style="height:50px;position:absolute;right:0px;top:7px"/>
        </a>
    </div>
</div>
<url-input-modal id="modal"></url-input-modal>
`;

class HomePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(homePageTemplate.content.cloneNode(true));
        this.initDOMElements();
    }

    initDOMElements() {
        this.localFileButton = this.shadowRoot.querySelector('#local-file-selection');
        this.remoteFileButton = this.shadowRoot.querySelector('#remote-file-selection-button');
        this.demoFileButton = this.shadowRoot.querySelector('#demo-data-selection-button');
        this.modal = this.shadowRoot.querySelector('#modal');
    }

    connectedCallback() {
        this.localFileButton.addEventListener('change', (event) => this.handleLocalFilePick(event));
        this.remoteFileButton.addEventListener('click', () => this.modal.showModal());
          // Handle the custom event from the url-input-modal
          this.modal.addEventListener('remote-file-loaded', (event) => {
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

    handleLocalFilePick(event) {
        const files = event.target.files;
    
        if (files.length === 2) {
            const file1 = files[0];
            const file2 = files[1];
    
            // Check for bam & bai or cram & crai file pair
            if ((file1.name.endsWith('.bam') && file2.name.endsWith('.bai')) || 
                (file1.name.endsWith('.bai') && file2.name.endsWith('.bam'))) {
                console.log('Processing BAM and BAI files:', file1.name, file2.name);
                this.dispatchLocalFileSelectionEvent(file1, file2);
            } 
            else if ((file1.name.endsWith('.cram') && file2.name.endsWith('.crai')) || 
                     (file1.name.endsWith('.crai') && file2.name.endsWith('.cram'))) {
                console.log('Processing CRAM and CRAI files:', file1.name, file2.name);
                this.dispatchLocalFileSelectionEvent(file1, file2);
            } 
            else {
                alert('Please select either bam & bai or cram & crai file pair.');
            }
        } else {
            alert('You must select two files: bam & bai or cram & crai.');
        }
    }

    dispatchLocalFileSelectionEvent(file1, file2) {
        const eventDetail = {
            file1: file1,
            file2: file2
        };
        const fileSelectionEvent = new CustomEvent('local-file-selected', {
            detail: eventDetail,
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(fileSelectionEvent);
    }

    handleDemoFilePick() {
        const demoFileUrl = 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam'
        this.navigateToMainContent(demoFileUrl, null);
        // const fileSelectionEvent =  new CustomEvent('demo-file-selected', { 
        //     detail: { url: demoFileUrl },
        //     bubbles: true,
        //     composed: true 
        // });

        // this.dispatchEvent(fileSelectionEvent);
    }

    // Navigate to the main content page with the URLs
    navigateToMainContent(url1, url2) {
        const queryParams = new URLSearchParams({
            'alignment-url': url1,
        });
        if (url2) {
            console.log(url2)
        }
        const mainContentUrl = `/?${queryParams.toString()}`;
        navigateTo(mainContentUrl);
    }
}

customElements.define('iobio-home-page', HomePage);
export { HomePage }